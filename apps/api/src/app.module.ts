import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organization.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

import { BillingModule } from './billing/billing.module';

import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './notifications/notifications.module';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AiModule } from './ai/ai.module';

import { AnalyticsModule } from './analytics/analytics.module';

import { TasksModule } from './tasks/tasks.module';

import { WebhooksModule } from './webhooks/webhooks.module';

import { BackupModule } from './backup/backup.module';

import { PluginsModule } from './plugins/plugins.module';

import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    AuthModule, 
    OrganizationModule,
    BillingModule,
    NotificationsModule,
    AiModule,
    AnalyticsModule,
    TasksModule,
    WebhooksModule,
    BackupModule,
    PluginsModule,
    MarketplaceModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    PrometheusModule.register(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      ttl: 600, // 10 minutes
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
