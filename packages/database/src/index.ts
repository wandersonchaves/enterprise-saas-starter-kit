export * from './generated/client/index.js'
export type { 
  Organization, 
  User, 
  Member, 
  Subscription, 
  Document, 
  Invite, 
  Webhook, 
  ApiKey, 
  AuditLog, 
  Plugin, 
  MarketplaceExtension, 
  InstalledExtension, 
  Workflow, 
  WorkflowStep 
} from './generated/client/index.js'
import { PrismaClient } from './generated/client/index.js'
import { AsyncLocalStorage } from 'node:async_hooks'

export const tenantContext = new AsyncLocalStorage<{ organizationId: string }>()

export const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const context = tenantContext.getStore()

        // Models that are NOT tenant-specific (global models)
        const globalModels = ['User', 'Account', 'Organization', 'MarketplaceExtension']

        if (globalModels.includes(model)) {
          return query(args)
        }

        // If we have an organizationId in context, inject it into the query
        if (context?.organizationId) {
          const anyArgs = args as any
          if (['findFirst', 'findMany', 'count', 'updateMany', 'deleteMany'].includes(operation)) {
            anyArgs.where = { ...anyArgs.where, organizationId: context.organizationId }
          } else if (['create', 'createMany'].includes(operation)) {
            if (Array.isArray(anyArgs.data)) {
              anyArgs.data = anyArgs.data.map((item: any) => ({
                ...item,
                organizationId: context.organizationId,
              }))
            } else {
              anyArgs.data = { ...anyArgs.data, organizationId: context.organizationId }
            }
          }
        }

        return query(args)
      },
    },
  },
})

export type ExtendedPrismaClient = typeof prisma
export { PrismaClient }
