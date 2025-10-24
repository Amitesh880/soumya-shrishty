import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Backfilling User.createdAt where missing or null...');

try {
  const result = await prisma.$runCommandRaw({
    update: 'User',
    updates: [
      {
        q: { $or: [ { createdAt: { $exists: false } }, { createdAt: null } ] },
        u: { $set: { createdAt: new Date(), updatedAt: new Date() } },
        multi: true,
        upsert: false,
      },
    ],
  });
  console.log('Update result:', JSON.stringify(result));
} catch (err) {
  console.error('Backfill failed:', err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}