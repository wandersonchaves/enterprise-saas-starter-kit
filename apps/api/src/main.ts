import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from monorepo root at the very beginning
dotenv.config({ path: path.join(process.cwd(), '../../.env') });
// fallback if running from within apps/api
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Sample 10% of traces and profiles in production; everything elsewhere.
  const sampleRate = process.env.NODE_ENV === 'production' ? 0.1 : 1.0;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: sampleRate,
    profilesSampleRate: sampleRate,
  });

  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
    rawBody: true,
  });

  app.use(helmet());
  // Allowed origins come from CORS_ORIGINS (comma separated), falling back to FRONTEND_URL.
  const corsOrigins = (
    process.env.CORS_ORIGINS ??
    process.env.FRONTEND_URL ??
    'http://localhost:3000'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TenantInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Enterprise SaaS Public API')
    .setDescription(
      'The public API for integrating with the Enterprise SaaS platform',
    )
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API is running on: http://localhost:${port}`);
}
bootstrap();
