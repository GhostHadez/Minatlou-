/**
 * =============================================================
 * PRISMA CLIENT
 * =============================================================
 * Exports a single, shared PrismaClient instance for the whole
 * app. In development, the instance is cached on the global
 * object so hot-reloading (ts-node/nodemon) doesn't exhaust the
 * Postgres connection pool by creating a new client on every
 * file change.
 * =============================================================
 */

import { PrismaClient } from '@prisma/client';
import { isDevelopment } from './env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ??
  new PrismaClient({
    log: isDevelopment ? ['warn', 'error'] : ['error'],
  });

if (isDevelopment) {
  global.__prisma = prisma;
}

/**
 * Call during graceful shutdown to close the database connection
 * pool cleanly.
 */
export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
