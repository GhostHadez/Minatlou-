/**
 * =============================================================
 * REQUEST LOGGING MIDDLEWARE
 * =============================================================
 * Uses Morgan's verbose 'dev' format (colored, concise) locally
 * and the standard Apache 'combined' format in production, which
 * is easier for log aggregators to parse.
 * =============================================================
 */

import morgan from 'morgan';
import { isProduction } from '../config/env';

export const requestLogger = morgan(isProduction ? 'combined' : 'dev');
