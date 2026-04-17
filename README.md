# Enterprise SaaS Starter Kit

Robust, performant and multi-tenant SaaS foundation following Clean Architecture.

## Tech Stack
- **Monorepo:** pnpm workspaces + Turbo
- **Backend:** NestJS, Prisma ORM, PostgreSQL, Redis
- **Frontend:** Next.js 14, Tailwind CSS, Shadcn/UI
- **Auth:** JWT + RBAC
- **Multi-tenancy:** Automated data isolation via Prisma Extension

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start Infrastructure (Postgres/Redis):**
   ```bash
   docker-compose up -d
   ```

3. **Database Setup:**
   ```bash
   cd packages/database
   npx prisma db push
   ```

4. **Run Development Mode:**
   ```bash
   pnpm dev
   ```

## Key Features Implemented
- [x] Multi-tenant Isolation (Prisma Extension + AsyncLocalStorage)
- [x] Authentication (JWT, Bcrypt, Register/Login)
- [x] Organization Management & RBAC Base
- [x] Shared Packages (Zod Schemas)
- [x] Global Error Handling
- [x] Frontend Foundation (Next.js, Tailwind, Shadcn/UI)
