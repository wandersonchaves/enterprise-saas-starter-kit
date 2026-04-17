import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@enterprise/database';

@Injectable()
export class QueryAnalyzerService implements OnModuleInit {
  private readonly logger = new Logger('QueryAnalyzer');
  private slowQueryThreshold = 500; 

  onModuleInit() {
    this.logger.log('Database Query Performance Audit initialized');
    
    const basePrisma = new PrismaClient();
    basePrisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      const duration = after - before;

      if (duration > this.slowQueryThreshold) {
        this.logger.warn(`SLOW QUERY: ${params.model}.${params.action} took ${duration}ms`, {
          model: params.model,
          action: params.action,
          duration
        });
      }

      return result;
    });
  }
}
