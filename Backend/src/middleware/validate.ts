/**
 * =============================================================
 * VALIDATION MIDDLEWARE
 * =============================================================
 * Generic middleware that runs an array of express-validator
 * chains, then checks the results. If validation fails, responds
 * with a 400 and a structured list of field errors instead of
 * calling next() — so route handlers never run with invalid input.
 *
 * Not wired to any routes yet (Sprint 1 has no business routes).
 * Sprint 2 will define the actual validation chains per-route,
 * e.g.:
 *
 *   import { body } from 'express-validator';
 *   import { validate } from '../middleware/validate';
 *
 *   router.post(
 *     '/register',
 *     validate([
 *       body('email').isEmail(),
 *       body('password').isLength({ min: 8 }),
 *     ]),
 *     authController.register
 *   );
 * =============================================================
 */

import { NextFunction, Request, Response } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse';

export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
      return;
    }

    const fieldErrors = result.array().map((error) => ({
      field: error.type === 'field' ? error.path : undefined,
      message: error.msg,
    }));

    sendError(res, 400, 'Validation failed', { fields: fieldErrors });
  };
}
