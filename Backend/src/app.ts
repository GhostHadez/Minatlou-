/**
 * =============================================================
 * EXPRESS APPLICATION
 * =============================================================
 * Assembles the Express app: security/parsing middleware, request
 * logging, rate limiting, versioned API routes, and finally the
 * 404 + error handlers. Exported (not started) so it can be
 * imported by both server.ts (real listener) and future test
 * suites (supertest against the app instance directly).
 *
 * Middleware order matters:
 *   1. helmet          — security headers, as early as possible
 *   2. cors            — must run before routes handle the request
 *   3. compression      — compress responses
 *   4. morgan            — log every request
 *   5. express.json/urlencoded — parse bodies before routes read them
 *   6. rate limiter       — throttle before hitting route logic
 *   7. versioned routes    — /api/v1/...
 *   8. 404 handler           — catches unmatched routes
 *   9. error handler          — must be LAST; catches everything above
 * =============================================================
 */

import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

import { corsOptions } from './config/cors';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import v1Routes from './routes/v1';

export function createApp(): Application {
  const app = express();

  // Trust the first proxy hop (e.g. Render/Heroku/Nginx) so
  // req.ip and rate limiting see the real client IP, not the proxy's.
  app.set('trust proxy', 1);

  // --- Security headers ---
  app.use(helmet());

  // --- CORS ---
  app.use(cors(corsOptions));

  // --- Response compression ---
  app.use(compression());

  // --- Request logging ---
  app.use(requestLogger);

  // --- Body parsing ---
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- Rate limiting (applied to the whole API surface) ---
  app.use(env.apiPrefix, apiRateLimiter);

  // --- Versioned API routes ---
  app.use(env.apiPrefix, v1Routes);

  // --- Root route: simple landing response, useful for smoke-testing the deploy ---
  app.get('/', (req, res) => {
    res.json({
      service: 'Minatlou Security & Projects — Backend API',
      status: 'running',
      apiPrefix: env.apiPrefix,
      health: `${env.apiPrefix}/health`,
    });
  });

  // --- 404 + error handling (must stay last, in this order) ---
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
