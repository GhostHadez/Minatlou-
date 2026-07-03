/**
 * =============================================================
 * HEALTH CONTROLLER
 * =============================================================
 * GET /api/v1/health
 * Returns basic server status plus a best-effort database
 * connectivity check, so uptime monitors / load balancers and
 * the ops team can distinguish "server is up" from "server is up
 * but can't reach Postgres."
 * =============================================================
 */

import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/apiResponse';

const startedAt = Date.now();

export async function getHealth(req: Request, res: Response): Promise<void> {
  let databaseStatus: 'connected' | 'unreachable' = 'unreachable';

  try {
    // Lightweight round-trip query — confirms the connection pool
    // can actually reach Postgres, not just that Prisma initialized.
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = 'connected';
  } catch {
    databaseStatus = 'unreachable';
  }

  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);

  sendSuccess(res, {
    status: 'ok',
    service: 'minatlou-backend',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    database: databaseStatus,
  });
}
