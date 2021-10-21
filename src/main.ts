import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@lib/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false
    })
  );

  // get express server running port for .env
  const config = app.get(ConfigService);

  const port = config.get('PORT');

  await app.listen(port);

  Logger.log('Server running on port ' + port, 'Bootstrap');
}
bootstrap();
