import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      orderBy: { pricePerNight: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        description: true,
        pricePerNight: true,
        capacity: true,
        amenities: true,
        images: true,
      },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

