/**
 * =============================================================
 * ENVIRONMENT CONFIGURATION
 * =============================================================
 * Single source of truth for all environment variables. Loads
 * and validates .env once at startup so the rest of the app can
 * import a typed `env` object instead of reading `process.env`
 * directly. Fails fast with a clear error if a required variable
 * is missing, rather than surfacing confusing errors later.
 * =============================================================
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface EnvConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
  databaseUrl: string;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  uploadDir: string;
  maxFileSizeMb: number;
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env file against .env.example.`
    );
  }
  return value;
}

function parseIntEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid integer, got: "${raw}"`);
  }
  return parsed;
}

function parseNodeEnv(): EnvConfig['nodeEnv'] {
  const raw = process.env.NODE_ENV ?? 'development';
  if (raw === 'development' || raw === 'production' || raw === 'test') return raw;
  return 'development';
}

export const env: EnvConfig = {
  nodeEnv: parseNodeEnv(),
  port: parseIntEnv('PORT', 4000),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  databaseUrl: requireEnv('DATABASE_URL'),
  corsOrigins: requireEnv('CORS_ORIGIN', 'http://localhost:8080')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimitWindowMs: parseIntEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  rateLimitMaxRequests: parseIntEnv('RATE_LIMIT_MAX_REQUESTS', 100),
  // JWT/upload config is validated leniently in Sprint 1 since those
  // features aren't implemented yet — real enforcement happens when
  // Sprint 2 wires up auth.ts and the applications upload middleware.
  jwtSecret: process.env.JWT_SECRET ?? 'dev-only-placeholder-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  maxFileSizeMb: parseIntEnv('MAX_FILE_SIZE_MB', 5),
};

export const isProduction = env.nodeEnv === 'production';
export const isDevelopment = env.nodeEnv === 'development';
export const isTest = env.nodeEnv === 'test';
