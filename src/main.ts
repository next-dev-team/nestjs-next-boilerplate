import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false
    })
  );
  //sample seeding
  // app.get(SamplesService);
  //app.use(bodyParser.graphql());

  // get express server runing port for .env

  const config = app.get(ConfigService);
  // const config = app.select(ConfigModule).get(ConfigService, { strict: true });

  const port = config.get('PORT');

  await app.listen(process.env.PORT || port);

  Logger.log('Server running on port ' + port, 'Bootstrap');
}
bootstrap();
