/**
 * =============================================================
 * API RESPONSE HELPERS
 * =============================================================
 * Wraps every successful response in a consistent envelope so
 * frontend error handling (which already expects `data.message`
 * on failure — see js/api.js) has a predictable shape to work
 * with on success too.
 *
 * Success shape:  { success: true, data: <payload> }
 * Error shape:     { success: false, message: <string>, details?: <any> }
 * =============================================================
 */

import { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details !== undefined ? { details } : {}),
  });
}
