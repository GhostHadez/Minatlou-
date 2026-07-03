/**
 * =============================================================
 * CORS CONFIGURATION
 * =============================================================
 * Restricts cross-origin requests to the allow-list configured
 * in CORS_ORIGIN. Requests with no Origin header (server-to-server,
 * curl, mobile apps) are allowed through, since the Origin header
 * is only sent by browsers.
 * =============================================================
 */

import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin "${origin}" is not allowed by CORS policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
