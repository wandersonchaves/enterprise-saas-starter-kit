# Backlog: Boilerplate v1

Each item has a definition of done. Work one step per branch and one pull request per step.

## Known issues to fix before any production use

Found in a read-only review of `apps/api` (not a full audit):

- [ ] **Membership check is skipped when the route has no `orgSlug`.** `MembershipGuard` returns `true` when neither a route parameter nor a query parameter provides it, so an authenticated route without that parameter has no tenant check. *Done when:* the guard denies by default, the tenant comes from the token or the route, and a test proves it.
- [ ] **API keys are stored and looked up in plain text.** `ApiKeyGuard` finds the key by its value. *Done when:* only a hash is stored, the key is shown once at creation, and comparison is constant-time.
- [ ] **CORS accepts any origin.** `app.enableCors()` has no origin list. *Done when:* allowed origins come from the environment.
- [ ] **Error monitoring samples 100% of traces and profiles.** *Done when:* the rates are configurable and lower in production, and no personal data is sent.

## Steps

1. [ ] **Architecture.** Extend `ARCHITECTURE.md` with the concrete folder layout and the dependency rule. Add one complete example module that follows it.
2. [ ] **Clean-up.** Remove the scaffold modules listed in `DECISIONS.md` (#5), in their own PR.
3. [ ] **Layers.** Move `organization` and `audit-logs` to `domain / application / infra / interface`, then the remaining contexts. Services must no longer import `PrismaService` directly.
4. [ ] **Multi-tenancy and the known issues above.** Single tenant context, isolation tests, row-level security spike.
5. [ ] **Payments.** `PaymentProvider` port, Pix adapter, idempotent webhooks, reconciliation job. Use sandbox credentials and fictional data only.
6. [ ] **Scheduling and notifications.** Minimal scheduling module. E-mail and the official WhatsApp Cloud API behind a port, WhatsApp disabled by default.
7. [ ] **Quality.** Domain tests without a database, integration tests with PostgreSQL in a container, end-to-end tests. At least 80% coverage on `domain` and `application`. Remove the lint warnings. CI adds secret scanning, dependency audit and static analysis.
8. [ ] **Template tooling.** A script that creates a new app from the template, and the README for template users.

## Definition of done for v1

- One command starts the environment and one runs the tests; CI is green.
- Tenant isolation is covered by tests.
- Payments are idempotent and reconcilable.
- No `PrismaService` import outside `infra`.
- `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` and this backlog are current.
