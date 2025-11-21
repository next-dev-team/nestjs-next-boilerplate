import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from '@lib/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Set global prefix
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  app.setGlobalPrefix(apiPrefix);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security
  app.use(helmet());

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Enterprise Boilerplate')
    .setDescription('Production-ready NestJS API with authentication and best practices')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('files', 'File upload endpoints')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
