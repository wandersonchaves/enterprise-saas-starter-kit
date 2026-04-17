import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { EMAIL_PROVIDER } from '../common/interfaces/email.interface';
import { ResendAdapter } from '../common/adapters/email/resend.adapter';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    {
      provide: EMAIL_PROVIDER,
      useClass: ResendAdapter,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
