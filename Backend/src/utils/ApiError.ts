/**
 * =============================================================
 * API ERROR
 * =============================================================
 * A typed error class for anything thrown intentionally by our
 * own code (controllers, services). Carries an HTTP status code
 * and an optional machine-readable `details` payload so the
 * central error handler can format a consistent JSON response.
 *
 * Usage:
 *   throw new ApiError(404, 'Job not found');
 *   throw new ApiError(400, 'Validation failed', { fields: [...] });
 * =============================================================
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    // Operational errors are expected/handled failures (bad input,
    // not found, etc.) as opposed to programming errors/bugs.
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict', details?: unknown): ApiError {
    return new ApiError(409, message, details);
  }

  static internal(message = 'Internal server error'): ApiError {
    return new ApiError(500, message);
  }
}
