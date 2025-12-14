import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from '@lib/configs';
import { LoggerService } from '@lib/logger/logger.service';
import { swaggerDescription, swaggerOptions } from '@common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  // Security
  app.use(helmet());

  // CORS
  const corsOrigin = configService.env.CORS_ORIGIN || '*';
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Enterprise Boilerplate')
    .setDescription(swaggerDescription)
    .setVersion('1.0')
    .addBearerAuth()
    .setExternalDoc('Postman Collection', '/docs-json')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, { swaggerOptions });

  const port = configService.env.PORT;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
