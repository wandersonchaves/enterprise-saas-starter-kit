import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuditLogsService {
  constructor(@InjectQueue('audit-logs') private readonly auditQueue: Queue) {}

  async log(data: {
    action: string;
    entity: string;
    entityId?: string;
    userId: string;
    organizationId: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Non-blocking call: just push to the queue and return immediately
    await this.auditQueue.add('save-log', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
