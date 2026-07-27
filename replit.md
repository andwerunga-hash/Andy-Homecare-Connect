# Andy Homecare Connect

Kenya's trusted marketplace connecting families with dedicated house helps — and house helps with dignified employment.

## Run & Operate

- `pnpm --filter @workspace/andy-homecare run dev` — run the frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Wouter (routing), TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/andy-homecare/` — React frontend
- `artifacts/api-server/src/routes/` — API routes (users, payments, stats, health)
- `lib/db/src/schema/` — users.ts, payments.ts
- `lib/api-spec/openapi.yaml` — API contract (source of truth)

## Product

- **Landing page** (`/`) — Hero with AI image, platform stats, featured profiles, how it works
- **Browse** (`/browse`) — Filter by role (employer/housekeeper), county, salary range, skill
- **Profile** (`/profile/:id`) — Full profile view with contact info (visible for verified users)
- **Register** (`/register`) — Choose role, fill profile (name, county, phone, salary, skills)
- **Payment** (`/payment`) — Mpesa instructions + transaction code submission
- **Edit Profile** (`/edit-profile/:id`) — Update own profile

## Mpesa Payment Details

- Paybill: **542542**
- Account: **22703**
- Amount: **Ksh 250** (both employers and housekeepers)

## Architecture decisions

- Registration fee of Ksh 250 via Mpesa is manually verified by admin (payment status: pending → verified)
- Contact info (phone, email) is visible on all profiles regardless of verification, enabling free direct interaction
- Photos are optional (avatar fallback shows initials)
- Skills stored as comma-separated text for simplicity

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any OpenAPI spec change, run codegen before touching backend routes: `pnpm --filter @workspace/api-spec run codegen`
- Do not use `format: email` in the OpenAPI spec — Orval generates `zod.email()` which doesn't exist in zod v4

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
