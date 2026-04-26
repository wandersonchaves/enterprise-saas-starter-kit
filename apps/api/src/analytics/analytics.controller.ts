import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { HttpCacheInterceptor } from '../common/interceptors/http-cache.interceptor';
import { CacheTTL, CacheKey } from '@nestjs/cache-manager';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheTTL(300) // 5 minutes cache for dashboard stats
  async getDashboard(@Headers('organization-id') organizationId: string) {
    return this.analyticsService.getDashboardStats(organizationId);
  }
}
