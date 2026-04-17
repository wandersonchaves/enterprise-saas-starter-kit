import { Module, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BackupProcessor } from './backup.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'backups',
    }),
  ],
  providers: [BackupProcessor],
})
export class BackupModule implements OnModuleInit {
  constructor(@InjectQueue('backups') private readonly backupQueue: Queue) {}

  async onModuleInit() {
    // Schedule daily backup at 3 AM
    await this.backupQueue.add('daily-db-backup', {}, {
      repeat: { pattern: '0 3 * * *' },
    });
  }
}
