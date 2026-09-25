import ical, { ICalCalendarMethod } from 'ical-generator';
import { db } from './db';

/**
 * Generate an iCal feed for a specific room
 */
export async function generateICalFeed(roomSlug: string) {
  const room = await db.room.findUnique({
    where: { slug: roomSlug },
    include: {
      bookings: {
        where: { status: 'CONFIRMED' },
        select: { id: true, checkIn: true, checkOut: true },
      },
      blockedDates: {
        select: { id: true, startDate: true, endDate: true, reason: true },
      },
    },
  });

  if (!room) {
    throw new Error(`Room with slug "${roomSlug}" not found`);
  }

  const calendar = ical({
    name: `House Of Karma - ${room.name}`,
    method: ICalCalendarMethod.PUBLISH,
    prodId: '//HouseOfKarma//HostelBooking//EN',
    timezone: 'Asia/Kolkata',
  });

  // Add confirmed bookings as events
  for (const booking of room.bookings) {
    calendar.createEvent({
      id: `booking-${booking.id}@houseofkarma.in`,
      start: booking.checkIn,
      end: booking.checkOut,
      allDay: true,
      summary: 'Reserved',
      description: 'Reserved via House Of Karma Direct Booking',
    });
  }

  // Add blocked dates as events
  for (const blocked of room.blockedDates) {
    // Strip internal tag like [Feed:...] from public export
    const cleanReason = (blocked.reason || 'Unavailable').replace(/^\[Feed:[^\]]+\]\s*/, '');
    calendar.createEvent({
      id: `blocked-${blocked.id}@houseofkarma.in`,
      start: blocked.startDate,
      end: blocked.endDate,
      allDay: true,
      summary: cleanReason,
      description: `Blocked: ${cleanReason}`,
    });
  }

  return calendar.toString();
}

/**
 * Parse an external iCal feed with timeout protection
 */
export async function parseExternalICalFeed(icalUrl: string, timeoutMs: number = 5000) {
  const fetchWithTimeout = async () => {
    // Dynamic import for node-ical (CommonJS/ESM interop)
    const nodeIcal = await import('node-ical');
    const parser = (nodeIcal as any).default?.async || (nodeIcal as any).async || (nodeIcal as any).default || nodeIcal;
    
    return typeof parser.fromURL === 'function' 
      ? await parser.fromURL(icalUrl) 
      : await (nodeIcal as any).fromURL(icalUrl);
  };

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`iCal fetch timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  const events = (await Promise.race([fetchWithTimeout(), timeoutPromise])) as Record<string, any>;

  const blockedRanges: Array<{
    start: Date;
    end: Date;
    summary: string;
  }> = [];

  for (const key in events) {
    const event = events[key];
    if (event.type === 'VEVENT' && event.start && event.end) {
      blockedRanges.push({
        start: new Date(event.start as unknown as string),
        end: new Date(event.end as unknown as string),
        summary: (event.summary as string) || 'OTA Booking',
      });
    }
  }

  return blockedRanges;
}

/**
 * Sync a single external iCal feed and update blocked dates in DB
 */
export async function syncExternalCalendar(feedId: string) {
  const feed = await db.iCalFeed.findUnique({
    where: { id: feedId },
    include: { room: true },
  });

  if (!feed || !feed.isActive) {
    throw new Error('Feed not found or inactive');
  }

  const blockedRanges = await parseExternalICalFeed(feed.externalUrl, 5000);

  // Remove old blocked dates associated with this specific feed
  await db.blockedDate.deleteMany({
    where: {
      roomId: feed.roomId,
      source: 'OTA_SYNC',
      OR: [
        { reason: { startsWith: `[Feed:${feed.id}]` } },
        { reason: { not: { startsWith: '[Feed:' } } }, // Cleans up legacy untagged records
      ],
    },
  });

  // Insert new blocked dates tagged with this feed ID
  for (const range of blockedRanges) {
    await db.blockedDate.create({
      data: {
        roomId: feed.roomId,
        startDate: range.start,
        endDate: range.end,
        source: 'OTA_SYNC',
        reason: `[Feed:${feed.id}] ${range.summary}`,
      },
    });
  }

  // Update last synced timestamp
  await db.iCalFeed.update({
    where: { id: feedId },
    data: { lastSynced: new Date() },
  });

  return { syncedCount: blockedRanges.length };
}

/**
 * Just-In-Time (JIT) sync for a room if its external feeds are stale.
 * Invoked on availability checks and checkout payments.
 */
export async function syncRoomIfStale(roomId: string, maxAgeMinutes: number = 3): Promise<void> {
  try {
    const feeds = await db.iCalFeed.findMany({
      where: { roomId, isActive: true },
    });

    if (feeds.length === 0) return;

    const thresholdTime = Date.now() - maxAgeMinutes * 60 * 1000;

    const staleFeeds = feeds.filter((feed) => {
      if (!feed.lastSynced) return true;
      return new Date(feed.lastSynced).getTime() < thresholdTime;
    });

    if (staleFeeds.length === 0) return;

    // Sync all stale feeds for this room concurrently
    await Promise.allSettled(
      staleFeeds.map((feed) => syncExternalCalendar(feed.id))
    );
  } catch (error) {
    console.warn(`JIT sync warning for room ${roomId}:`, error);
  }
}

/**
 * Background sync for ALL active feeds across all rooms (used by Vercel Cron)
 */
export async function syncAllActiveFeeds() {
  const feeds = await db.iCalFeed.findMany({
    where: { isActive: true },
    include: { room: true },
  });

  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const res = await syncExternalCalendar(feed.id);
      return {
        feedId: feed.id,
        roomName: feed.room.name,
        syncedCount: res.syncedCount,
      };
    })
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return {
    totalFeeds: feeds.length,
    succeeded,
    failed,
    details: results.map((r, i) => ({
      feedId: feeds[i].id,
      roomName: feeds[i].room.name,
      status: r.status,
      result: r.status === 'fulfilled' ? (r as PromiseFulfilledResult<any>).value : (r as PromiseRejectedResult).reason?.message,
    })),
  };
}
