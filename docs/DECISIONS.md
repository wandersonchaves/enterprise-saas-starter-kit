# Architecture decisions

Short records of the choices that shape this template. Each entry says what was decided, why, and what it costs. New decisions go at the end, with the date.

## 1. NestJS for the API, Next.js for the interface (2026-11-05)

- **Decision:** the API is a NestJS application; Next.js is used only for the web interface and marketing pages.
- **Why:** NestJS modules, dependency injection and decorators fit ports and adapters, which Clean Architecture and DDD need. Keeping business rules out of the web framework makes them testable without a browser or a server.
- **Cost:** two deployable apps instead of one. Shared types and Zod schemas live in `packages/common` to avoid drift.

## 2. Layers per bounded context (2026-11-05)

- **Decision:** each context in `apps/api/src` is split into `domain` (entities, value objects, rules, no framework), `application` (use cases and ports), `infra` (adapters: database, queues, payments, e-mail) and `interface` (HTTP controllers). Dependencies point inward.
- **Why:** `ARCHITECTURE.md` states the principle, but today 14 services call `PrismaService` directly. This decision makes the target explicit so the refactor can be done one context at a time.
- **Cost:** more files per feature. The example module (see the backlog) shows the pattern so new contexts can be copied.

## 3. Tenant isolation is tested, not assumed (2026-11-05)

- **Decision:** every tenant-scoped query goes through one tenant context, and there are tests proving that one tenant cannot read another tenant's data. PostgreSQL row-level security is evaluated in a short spike and the result recorded here.
- **Why:** isolation currently relies on `organizationId` filters written by hand in each query.

## 4. Payments behind a port (2026-11-05)

- **Decision:** a `PaymentProvider` port. Stripe stays as one adapter; a Brazilian Pix adapter (instant charges and recurring Pix) is added. Webhook events are stored with a unique `(kind, externalId)` key before being processed, and a reconciliation job compares the provider's records with the local ledger.
- **Why:** webhooks are delivered more than once and out of order; storing first makes processing idempotent.

## 5. Scaffold modules are removed unless a real app needs them (2026-11-05)

- **Decision:** the README already marks `agents`, `ai`, `analytics`, `datalake`, `finops`, `gdpr`, `marketplace`, `plugins` and `workflows` as scaffold only. They are removed from the template (or moved to a separate branch) in a dedicated PR.
- **Why:** unfinished modules look like features and make a security review longer.

## 6. Quality, security and privacy gates (2026-11-05)

- **Decision:** CI runs lint, tests, build, secret scanning, dependency audit and static analysis from the first commit of any app created from this template. Before an app reaches customers it also passes a production gate: threat model, dynamic scan, cross-tenant access test, backup restore test and a data-protection review (LGPD).
- **Why:** these checks are cheap early and expensive late.
