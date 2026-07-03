/**
 * =============================================================
 * ASYNC HANDLER
 * =============================================================
 * Wraps an async Express route handler so any rejected Promise
 * is forwarded to next(), letting the central error middleware
 * handle it. Without this, an unhandled rejection in an async
 * controller would crash the request silently instead of
 * returning a proper error response.
 *
 * Usage:
 *   router.get('/health', asyncHandler(healthController.check));
 * =============================================================
 */

import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export function asyncHandler(handler: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
