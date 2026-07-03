/**
 * =============================================================
 * PRISMA SEED SCRIPT
 * =============================================================
 * Sprint 1: intentionally a no-op. No business data (users, jobs,
 * applications) is seeded yet, since Sprint 1 only covers schema
 * + foundation, not business logic.
 *
 * Sprint 2+ will populate this with, e.g., an initial AdminUser
 * and a handful of sample Jobs so the careers page has real data
 * to render instead of the frontend's fallback sample data.
 *
 * Run with: npm run prisma:seed
 * =============================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seed script ready — no seed data defined yet (Sprint 1 foundation only).');
}

main()
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
