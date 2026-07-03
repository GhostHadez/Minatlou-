/**
 * =============================================================
 * RATE LIMITING MIDDLEWARE
 * =============================================================
 * General-purpose limiter applied to the whole API to guard
 * against abuse/brute-force. Sprint 2 can layer a stricter,
 * dedicated limiter on top of sensitive routes (e.g. login,
 * register) using the same `rateLimit()` factory.
 * =============================================================
 */

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { sendError } from '../utils/apiResponse';

export const apiRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 429, 'Too many requests. Please try again later.');
  },
});
