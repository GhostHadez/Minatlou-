/**
 * =============================================================
 * API v1 ROUTES
 * =============================================================
 * Mounts every v1 route module under a single router, which
 * app.ts then mounts at the configured API_PREFIX (/api/v1).
 * Sprint 2+ will add: authRoutes, jobRoutes, applicationRoutes,
 * profileRoutes, adminRoutes — each following this same pattern.
 * =============================================================
 */

import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);

// Sprint 2+:
// router.use('/auth', authRoutes);
// router.use('/jobs', jobRoutes);
// router.use('/applications', applicationRoutes);
// router.use('/profile', profileRoutes);
// router.use('/admin', adminRoutes);

export default router;
