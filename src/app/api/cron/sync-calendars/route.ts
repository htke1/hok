import { NextResponse } from 'next/server';
import { syncAllActiveFeeds } from '@/lib/ical';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Allow up to 60 seconds on Vercel Pro/Hobby if needed

export async function GET(request: Request) {
  try {
    // Optional CRON_SECRET verification for secure execution
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results = await syncAllActiveFeeds();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error('Cron calendar sync failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}

