import { Controller, Get, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboard(@Headers('organization-id') organizationId: string) {
    return this.analyticsService.getDashboardStats(organizationId);
  }
}
