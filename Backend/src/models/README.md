# models/

This project uses **Prisma** as its ORM, so the actual data models
(User, Profile, Job, Application, Document, AdminUser) are defined in
`prisma/schema.prisma` and consumed via the generated `@prisma/client`
(see `src/config/prisma.ts`).

This directory is reserved for Sprint 2+, when repository/data-access
classes may be introduced to wrap Prisma queries per-entity (e.g.
`user.repository.ts`, `job.repository.ts`) — keeping controllers thin
and query logic centralized and testable.

Left intentionally empty in Sprint 1 (foundation only — no business
logic yet).
