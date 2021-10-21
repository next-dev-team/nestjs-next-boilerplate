import { Module } from '@nestjs/common';

import { ConfigModule } from '@lib/config';
import { GraphQLModule } from '@lib/graphql';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';
import { JwtModule } from '@lib/jwt';
import { MongooseModule } from '@lib/mongoose';
import { TypeOrmModule } from '@lib/typeorm';

import { ApisModules } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModules } from './graphql/graphql.module';
import { HelpersModule } from './helpers/helpers.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    MongooseModule,
    TypeOrmModule,
    I18NextModule,
    GraphQLModule,
    HelpersModule,
    ConfigModule,
    IORedisModule,
    ApisModules,
    JwtModule,
    GraphQLModules
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
