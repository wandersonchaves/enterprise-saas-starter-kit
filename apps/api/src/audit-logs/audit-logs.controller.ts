import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { CurrentOrg } from '../common/decorators/org.decorator';
import type { Organization } from '@enterprise/database';

@Controller('audit-logs')
@UseGuards(ClerkGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async getLogs(@CurrentOrg() org: Organization) {
    return this.auditLogsService.getLogs(org.id);
  }
}
