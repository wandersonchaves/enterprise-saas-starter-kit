# Enterprise SaaS Starter Kit

A **template** for a multi-tenant B2B SaaS: a NestJS API, a Next.js web app, Prisma/PostgreSQL, background jobs and basic observability, wired together as a Turborepo monorepo.

This repository is a starting point, not a product. Applications built from it should get their own README (see [Using it as a template](#using-it-as-a-template)).

## What is implemented

| Area | Status | Notes |
| --- | --- | --- |
| Monorepo (Turborepo, pnpm) | Working | `apps/web`, `apps/api`, `apps/gateway`, `packages/database`, `packages/common`, `packages/events` |
| Multi-tenancy | Working | `Organization` and `Member` models; API guards check Clerk auth and organization membership; queries are scoped by `organizationId` |
| Auth | Working | Clerk (web and API guards) and Clerk webhooks |
| Billing | Basic | Stripe Checkout session creation and a subscription model |
| Audit log | Working | Writes go through a BullMQ queue (`audit-logs`) into the `AuditLog` table; read endpoint per organization |
| Background jobs | Working | BullMQ on Redis (`audit-logs`, `notifications`) |
| Email | Basic | Resend adapter, with a mock adapter outside production |
| Observability | Basic | OpenTelemetry tracing set up in the API and gateway; Prometheus metrics; sample `infra/monitoring/prometheus.yml` |
| Gateway | Minimal | Proxies `/api` to the API; not a real routing layer yet |
| Infra (Terraform) | Draft | `infra/terraform` (ALB, RDS, ElastiCache). Not applied or validated |
| `agents`, `ai`, `analytics`, `datalake`, `finops`, `gdpr`, `marketplace`, `plugins`, `workflows` | Scaffold only | Small placeholder modules (about 30 to 85 lines each). Do not treat them as features |

Not claimed: compliance certifications (SOC 2, GDPR) and load or latency figures. The audit log is an application-level trail, not an audit.

## Tech stack

- **Web:** Next.js 14 (App Router), Tailwind CSS, Clerk
- **API:** NestJS 11, Prisma 7, PostgreSQL, Redis, BullMQ, Stripe, Svix, `prom-client`, OpenTelemetry
- **Tooling:** pnpm 9, Turborepo, GitHub Actions (lint and build)

## Getting started

Requirements: Node.js 20+, pnpm, Docker (PostgreSQL and Redis).

```bash
pnpm install
docker compose up -d        # PostgreSQL and Redis
pnpm --filter @enterprise/database db:generate
pnpm dev
```

Environment variables:

```env
# apps/web/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:3001

# apps/api/.env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
REDIS_HOST="localhost"
REDIS_PORT=6379
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Production notes

```bash
pnpm build
pnpm --filter @enterprise/database prisma migrate deploy   # before starting the API
```

- Deploy `apps/web` (for example Vercel) and `apps/api` (a host with PostgreSQL and Redis reachable).
- Register the production webhook URLs in Clerk and Stripe.

## Tests and CI

CI (GitHub Actions) runs lint and build with Turborepo. **It is currently red on `main`**: `apps/api` lint reports 232 errors (mostly `no-unsafe-*` in the e2e specs) and `apps/web` has no ESLint config, so `next lint` waits for an interactive prompt. Test coverage is minimal: only the default controller specs of `apps/api` and `apps/gateway` exist.

## Using it as a template

1. Create the new repository with **Use this template**.
2. Replace this README with one that describes the new application: the problem it solves, who uses it, what differs from the template, how to run it.
3. Delete the scaffold modules you do not need.
4. Keep template improvements here and application code in the application repository.

## Project structure

- `apps/web`: Next.js front end
- `apps/api`: NestJS API (Clean Architecture-style layering; see [`ARCHITECTURE.md`](ARCHITECTURE.md))
- `apps/gateway`: minimal proxy in front of the API
- `packages/database`: Prisma schema and migrations
- `packages/common`: shared types and utilities
- `packages/events`: shared event definitions
- `infra`: Terraform draft and Prometheus config

## License

MIT. See [`LICENSE`](LICENSE).
