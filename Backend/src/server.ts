/**
 * =============================================================
 * SERVER ENTRY POINT
 * =============================================================
 * Starts the HTTP listener and wires up graceful shutdown so
 * in-flight requests finish and the Prisma connection pool
 * closes cleanly on SIGTERM/SIGINT (important for zero-downtime
 * deploys and local Ctrl+C).
 * =============================================================
 */

import { createApp } from './app';
import { env } from './config/env';
import { disconnectPrisma } from './config/prisma';

const app = createApp();

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(
    [
      '',
      `  Minatlou Backend — running in ${env.nodeEnv} mode`,
      `  Listening on:   http://localhost:${env.port}`,
      `  Health check:   http://localhost:${env.port}${env.apiPrefix}/health`,
      '',
    ].join('\n')
  );
});

async function shutdown(signal: string): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`\n${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    await disconnectPrisma();
    // eslint-disable-next-line no-console
    console.log('Shutdown complete.');
    process.exit(0);
  });

  // Force-exit if shutdown hangs for more than 10s.
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
