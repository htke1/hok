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
      description: 'Reserved via Direct Booking',
    });
  }

  // Add blocked dates as events
  for (const blocked of room.blockedDates) {
    calendar.createEvent({
      id: `blocked-${blocked.id}@houseofkarma.in`,
      start: blocked.startDate,
      end: blocked.endDate,
      allDay: true,
      summary: blocked.reason || 'Unavailable',
      description: `Blocked: ${blocked.reason || 'Manual block'}`,
    });
  }

  return calendar.toString();
}

/**
 * Parse an external iCal feed and return blocked date ranges
 */
export async function parseExternalICalFeed(icalUrl: string) {
  // Dynamic import for node-ical (CommonJS module)
  const nodeIcal = await import('node-ical');
  const events = await nodeIcal.async.fromURL(icalUrl);

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
 * Sync an external iCal feed and update blocked dates in DB
 */
export async function syncExternalCalendar(feedId: string) {
  const feed = await db.iCalFeed.findUnique({
    where: { id: feedId },
    include: { room: true },
  });

  if (!feed || !feed.isActive) {
    throw new Error('Feed not found or inactive');
  }

  const blockedRanges = await parseExternalICalFeed(feed.externalUrl);

  // Remove old OTA_SYNC blocked dates for this room
  await db.blockedDate.deleteMany({
    where: {
      roomId: feed.roomId,
      source: 'OTA_SYNC',
    },
  });

  // Insert new blocked dates
  for (const range of blockedRanges) {
    await db.blockedDate.create({
      data: {
        roomId: feed.roomId,
        startDate: range.start,
        endDate: range.end,
        source: 'OTA_SYNC',
        reason: range.summary,
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

