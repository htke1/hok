import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rooms = await db.room.findMany({
      orderBy: { pricePerNight: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        pricePerNight: true,
        capacity: true,
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching admin rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

