import { PrismaClient } from '../generated/prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseConfig } from '../src/config/env';

const connectionString = databaseConfig.url;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Check if users table is empty
  const existingUserCount = await prisma.user.count();

  if (existingUserCount > 0) {
    console.log(`Database already has ${existingUserCount} user(s). Skipping seed.`);
    return;
  }

  console.log('Seeding database with initial users...');

  // Create three users with different roles
  const users = await Promise.all([
    // 1. Regular USER
    prisma.user.create({
      data: {
        email: 'user@domain.com',
        name: 'User',
        password: '$2a$12$Hmsvt3M0zigCl6.ww35gjeKdSGbjvWfqHrKOaPH/ixjbFh/cO0UMK',
        role: 'USER',
        status: 'ACTIVE',
      },
    }),

    // 2. SELLER
    prisma.user.create({
      data: {
        email: 'seller@domain.com',
        name: 'Seller',
        password: '$2a$12$Hmsvt3M0zigCl6.ww35gjeKdSGbjvWfqHrKOaPH/ixjbFh/cO0UMK',
        role: 'SELLER',
        status: 'ACTIVE',
      },
    }),

    // 3. ADMIN
    prisma.user.create({
      data: {
        email: 'admin@domain.com',
        name: 'Admin',
        password: '$2a$12$Hmsvt3M0zigCl6.ww35gjeKdSGbjvWfqHrKOaPH/ixjbFh/cO0UMK',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    }),
  ]);

  console.log('✅ Created users:');
  users.forEach((user) => {
    console.log(`   - ${user.email} (${user.role}) - ID: ${user.id}`);
  });

  console.log('🎉 Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
