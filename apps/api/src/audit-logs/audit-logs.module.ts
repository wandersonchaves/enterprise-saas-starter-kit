import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsProcessor } from './audit-logs.processor';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audit-logs',
    }),
  ],
  providers: [AuditLogsService, AuditLogsProcessor, PrismaService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
