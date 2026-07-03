/**
 * =============================================================
 * ERROR HANDLING MIDDLEWARE
 * =============================================================
 * Must be registered LAST, after all routes. Catches every error
 * forwarded via next(err) — including ones thrown inside
 * asyncHandler-wrapped controllers — and formats a consistent
 * JSON error response.
 *
 * Known ApiError instances are trusted (their statusCode and
 * message are shown to the client). Anything else is treated as
 * an unexpected bug: logged in full server-side, but shown to
 * the client as a generic 500 in production (to avoid leaking
 * stack traces / internals), or with detail in development.
 * =============================================================
 */

import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/apiResponse';
import { isDevelopment } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, `Cannot ${req.method} ${req.originalUrl}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.details);
    return;
  }

  // Unexpected/programming error — log the full error for
  // debugging, but don't leak internals to the client.
  // eslint-disable-next-line no-console
  console.error('[Unhandled Error]', err);

  const message =
    isDevelopment && err instanceof Error ? err.message : 'Something went wrong. Please try again later.';

  sendError(res, 500, message, isDevelopment && err instanceof Error ? { stack: err.stack } : undefined);
}
