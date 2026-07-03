# Minatlou Security & Projects — Backend API

Backend for the Minatlou job portal. Node.js + Express + TypeScript +
PostgreSQL (via Prisma ORM).

> **Sprint status: Sprint 1 — Foundation only.**
> This sprint sets up the project skeleton, middleware stack, database
> schema, and a health check endpoint. **No authentication, jobs,
> applications, or dashboard business logic has been implemented yet.**
> See [Sprint 2 Handover](#sprint-2-handover) at the bottom for what's next.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Language | TypeScript (strict mode) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth (Sprint 2) | JWT (`jsonwebtoken`, `bcrypt`) |
| File uploads (Sprint 2) | Multer |

---

## Project Structure

```
backend/
├── src/
│   ├── config/           Environment, Prisma client, CORS — all env-driven setup
│   │   ├── env.ts           Validated, typed environment variables
│   │   ├── prisma.ts         Shared Prisma client singleton
│   │   └── cors.ts            CORS allow-list configuration
│   ├── controllers/       Request handlers (Sprint 1: health only)
│   │   └── health.controller.ts
│   ├── middleware/         Cross-cutting request handling
│   │   ├── errorHandler.ts    Central error + 404 handler
│   │   ├── rateLimiter.ts      Request throttling
│   │   ├── requestLogger.ts     Morgan logging config
│   │   └── validate.ts           express-validator wrapper (ready for Sprint 2)
│   ├── models/              Reserved for future repository/data-access layer
│   ├── routes/
│   │   └── v1/                 All /api/v1 routes
│   │       ├── health.routes.ts
│   │       └── index.ts           Aggregates all v1 routes
│   ├── services/            Reserved for business logic (Sprint 2+)
│   ├── utils/
│   │   ├── ApiError.ts          Typed error class with HTTP status codes
│   │   ├── apiResponse.ts        Consistent success/error JSON envelope
│   │   └── asyncHandler.ts        Wraps async route handlers for error forwarding
│   ├── types/
│   │   └── index.ts               Re-exports Prisma model types
│   ├── app.ts                Express app assembly (all middleware wired here)
│   └── server.ts              Entry point — starts the HTTP listener
├── prisma/
│   ├── schema.prisma          Full data model (see below)
│   ├── seed.ts                  No-op placeholder for Sprint 2+ seed data
│   └── migrations/               Generated SQL migrations
├── uploads/                  File storage root (Sprint 2 — CV/document uploads)
│   ├── cv/
│   └── documents/
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

---

## Getting Started

### 1. Prerequisites

- Node.js 18 or later
- A running PostgreSQL instance (local, Docker, or hosted)

### 2. Install dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to point at your Postgres instance:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/minatlou_db?schema=public"
```

Also set `CORS_ORIGIN` to match wherever the frontend is being served
from locally (e.g. `http://localhost:8080` if using `python3 -m http.server`
on the `frontend/` folder).

### 4. Create the database and run migrations

```bash
npm run prisma:migrate
```

This applies `prisma/migrations/` against your database and regenerates
the Prisma Client. (Alternatively, `npm run prisma:migrate:deploy` applies
existing migrations without prompting to create a new one — use this in
CI/production.)

### 5. Start the dev server

```bash
npm run dev
```

The server starts on `http://localhost:4000` (or whatever `PORT` is set
to) with hot-reload via `nodemon`.

### 6. Verify it's running

```bash
curl http://localhost:4000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "minatlou-backend",
    "timestamp": "2026-07-02T08:00:00.000Z",
    "uptimeSeconds": 12,
    "database": "connected"
  }
}
```

If `database` shows `"unreachable"`, double check `DATABASE_URL` and that
Postgres is running and accepting connections.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server with hot-reload (ts-node + nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build (`dist/server.js`) |
| `npm run prisma:generate` | Regenerate the Prisma Client from the schema |
| `npm run prisma:migrate` | Create + apply a new migration (dev) |
| `npm run prisma:migrate:deploy` | Apply existing migrations without prompts (CI/prod) |
| `npm run prisma:studio` | Open Prisma Studio (visual DB browser) |
| `npm run prisma:seed` | Run the seed script |
| `npm run lint` | Lint the codebase |
| `npm run typecheck` | Run the TypeScript compiler in check-only mode |

---

## Middleware Stack (in order)

`src/app.ts` wires up middleware in this exact order, which matters:

1. **helmet** — sets security-related HTTP headers
2. **cors** — enforces the `CORS_ORIGIN` allow-list
3. **compression** — gzips responses
4. **morgan** — logs every request (`dev` format locally, `combined` in production)
5. **express.json / express.urlencoded** — parses request bodies
6. **rate limiter** — throttles requests per IP (`RATE_LIMIT_*` env vars)
7. **versioned routes** — everything under `API_PREFIX` (`/api/v1`)
8. **404 handler** — catches unmatched routes
9. **error handler** — must stay last; formats every thrown/forwarded error into a consistent JSON response

## API Versioning

All routes are mounted under `/api/v1` (configurable via `API_PREFIX` in
`.env`). Sprint 2's auth/jobs/applications/profile routes will follow the
same pattern — new route modules dropped into `src/routes/v1/` and
registered in `src/routes/v1/index.ts`.

> **Note for the frontend team:** the existing frontend's `js/api.js`
> currently calls unversioned paths (`/api/auth/login`, `/api/jobs`, etc.).
> When Sprint 2 wires up real requests, either update `API_BASE_URL`'s
> paths in `js/api.js` to include `/v1`, or adjust `API_PREFIX` here to
> `/api` to match — whichever the team decides. This is a one-line change
> on either side, called out explicitly so it isn't missed.

## Response Format

Every endpoint returns a consistent envelope:

**Success:**
```json
{ "success": true, "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "Human-readable error", "details": { ... } }
```

This matches what the frontend's `js/api.js` already expects on failure
(`err.message`, `err.data`), so Sprint 2 controllers can rely on
`sendSuccess()` / `sendError()` (in `src/utils/apiResponse.ts`) without
needing frontend changes to the error-handling path.

---

## Database Schema

Defined in `prisma/schema.prisma`. Six models, matching the field names
the frontend already expects in its rendered UI:

| Model | Purpose |
|---|---|
| **User** | A registered job applicant (auth implemented in Sprint 2) |
| **Profile** | One-to-one extension of User (address, ID number, bio, avatar) |
| **Job** | A job listing — title, location, type, description, responsibilities, requirements |
| **Application** | Links a User to a Job; carries `status` (Pending/Approved/Rejected) |
| **Document** | An uploaded file (CV or supporting document) attached to an Application |
| **AdminUser** | A staff account that posts jobs and reviews applications (separate from applicant Users) |

### Relationships

- `User` 1—1 `Profile`
- `User` 1—many `Application`
- `Job` 1—many `Application` (unique per `userId` + `jobId` — one application per user per job)
- `Application` 1—many `Document`
- `AdminUser` 1—many `Job` (as poster)
- `AdminUser` 1—many `Application` (as reviewer)

No business logic (password hashing, status transitions, file handling)
is implemented against this schema yet — Sprint 2 builds on top of it.

---

## Security & Ops Middleware Included

- **Helmet** — standard security headers
- **CORS** — origin allow-list via `CORS_ORIGIN`
- **express-rate-limit** — configurable window/max via `RATE_LIMIT_*`
- **Centralized error handling** — `ApiError` class + `errorHandler` middleware; stack traces only shown in development
- **Validation scaffold** — `validate()` middleware wraps `express-validator`, ready for Sprint 2's route-level validation chains
- **Graceful shutdown** — `SIGTERM`/`SIGINT` close the HTTP server and Prisma connection pool cleanly

---

## Sprint 2 Handover

What's deliberately **not** built yet, and where it plugs in:

| Feature | Where it goes |
|---|---|
| `POST /api/v1/auth/register`, `/login`, `/forgot-password` | New `src/controllers/auth.controller.ts` + `src/routes/v1/auth.routes.ts` + `src/services/auth.service.ts` (bcrypt hashing, JWT issuance) |
| `GET /api/v1/jobs`, `GET /api/v1/jobs/:id` | `src/controllers/job.controller.ts` + `job.routes.ts` |
| `POST /api/v1/applications/:jobId`, `GET /api/v1/applications` | `application.controller.ts` + Multer config for CV/document uploads into `uploads/cv` and `uploads/documents` |
| `GET/PATCH /api/v1/profile` | `profile.controller.ts` |
| JWT auth middleware (protect routes, attach `req.user`) | `src/middleware/authenticate.ts` — `env.jwtSecret` / `env.jwtExpiresIn` are already defined in `config/env.ts`, just unused until this lands |
| Admin review endpoints | `src/routes/v1/admin.routes.ts`, gated by an `authenticateAdmin` middleware |

The `.env.example` already has placeholders (`JWT_SECRET`, `JWT_EXPIRES_IN`,
`UPLOAD_DIR`, `MAX_FILE_SIZE_MB`) for these features so Sprint 2 doesn't
need to touch environment configuration, only implement the logic that
reads them.
