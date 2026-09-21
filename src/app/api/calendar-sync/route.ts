import { NextResponse } from 'next/server';
import { syncExternalCalendar } from '@/lib/ical';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedId } = await request.json();

    if (!feedId) {
      return NextResponse.json({ error: 'Feed ID is required' }, { status: 400 });
    }

    const result = await syncExternalCalendar(feedId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
