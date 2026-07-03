/**
 * =============================================================
 * SHARED TYPES
 * =============================================================
 * Sprint 1 has no business-logic types yet (no DTOs, no request/
 * response interfaces for auth/jobs/applications — those land in
 * Sprint 2 alongside their routes). This file just re-exports the
 * Prisma-generated model types so the rest of the app has one
 * place to import them from, e.g.:
 *
 *   import { User, Job, Application } from '../types';
 *
 * instead of reaching into '@prisma/client' everywhere.
 * =============================================================
 */

export type {
  User,
  Profile,
  Job,
  Application,
  Document,
  AdminUser,
  JobType,
  ApplicationStatus,
  DocumentType,
} from '@prisma/client';
