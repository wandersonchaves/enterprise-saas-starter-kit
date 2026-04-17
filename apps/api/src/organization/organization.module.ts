import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../prisma/prisma.service';
import { EMAIL_PROVIDER } from '../common/interfaces/email.interface';
import { ResendAdapter } from '../common/adapters/email/resend.adapter';

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    PrismaService,
    {
      provide: EMAIL_PROVIDER,
      useClass: ResendAdapter,
    },
  ],
})
export class OrganizationModule {}
