import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { ConfigService } from '@lib/config';
import { RedisIoAdapter } from '@lib/socket';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'assets', 'html'));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false
    })
  );
  // get express server running port for .env
  const config = app.get(ConfigService);

  app.useWebSocketAdapter(new RedisIoAdapter(app, config));

  const port = config.get('PORT');

  await app.listen(port);

  Logger.log('Server running on port ' + port, 'Bootstrap');
}
bootstrap();
