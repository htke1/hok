import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Rooms
  const rooms = [
    {
      name: 'Dorm Pod - Mixed',
      slug: 'dorm-pod-mixed',
      type: 'DORM',
      description: 'Comfortable and affordable mixed dorm pod for backpackers.',
      pricePerNight: 599,
      capacity: 8,
      amenities: JSON.stringify([
        'Privacy curtains',
        'Reading light',
        'Universal plug',
        'Personal lockbox',
        'Shared bathroom',
        'Fresh linens'
      ]),
      images: JSON.stringify(['/images/rooms/dorm-mixed-1.webp'])
    },
    {
      name: 'Dorm Pod - Female Only',
      slug: 'dorm-pod-female',
      type: 'DORM',
      description: 'Safe and secure female-only dorm pod.',
      pricePerNight: 699,
      capacity: 6,
      amenities: JSON.stringify([
        'Privacy curtains',
        'Reading light',
        'Universal plug',
        'Personal lockbox',
        'Shared bathroom',
        'Fresh linens',
        'Female-only floor'
      ]),
      images: JSON.stringify(['/images/rooms/dorm-female-1.webp'])
    },
    {
      name: 'Private Himalayan Room - Standard',
      slug: 'private-standard',
      type: 'PRIVATE',
      description: 'Cozy private room with a beautiful mountain view.',
      pricePerNight: 2499,
      capacity: 2,
      amenities: JSON.stringify([
        'Ensuite bathroom',
        'Mountain view',
        'Work desk',
        'Room heater',
        'Hot shower',
        'Tea maker'
      ]),
      images: JSON.stringify(['/images/rooms/private-std-1.webp'])
    },
    {
      name: 'Private Himalayan Room - Deluxe',
      slug: 'private-deluxe',
      type: 'PRIVATE',
      description: 'Luxurious private room with balcony and premium features.',
      pricePerNight: 3499,
      capacity: 2,
      amenities: JSON.stringify([
        'Ensuite bathroom',
        'Mountain view',
        'Work desk',
        'Room heater',
        'Hot shower',
        'Tea maker',
        'Balcony',
        'Premium bedding',
        'Valley view'
      ]),
      images: JSON.stringify(['/images/rooms/private-dlx-1.webp'])
    }
  ]

  for (const roomData of rooms) {
    const room = await prisma.room.upsert({
      where: { slug: roomData.slug },
      update: roomData,
      create: roomData,
    })
    console.log(`Created/updated room: ${room.name}`)
  }

  // Admin User
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: { passwordHash },
    create: {
      username: adminUsername,
      passwordHash,
    },
  })
  console.log(`Created/updated admin user: ${admin.username}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
