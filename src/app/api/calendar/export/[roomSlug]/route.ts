import { NextResponse } from 'next/server';
import { generateICalFeed } from '@/lib/ical';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomSlug: string }> }
) {
  try {
    const { roomSlug: rawSlug } = await params;
    const roomSlug = rawSlug?.replace(/\.ics$/i, '');
    
    if (!roomSlug) {
      return new NextResponse('Room slug is required', { status: 400 });
    }

    const icalFeed = await generateICalFeed(roomSlug);

    if (!icalFeed) {
      return new NextResponse('Room not found or no feed available', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', 'text/calendar; charset=utf-8');
    headers.set('Content-Disposition', `attachment; filename="room-${roomSlug}.ics"`);
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new NextResponse(icalFeed, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('ICal export error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
