import { Module } from '@nestjs/common';

import { ConfigModule } from '@lib/config';
import { GraphQLModule } from '@lib/graphql';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';
import { JwtModule } from '@lib/jwt';
import { MongooseModule } from '@lib/mongoose';
import { SocketModule } from '@lib/socket';

import { ApisModules } from './api/api.module';
import { AppController } from './app.controller';
import { GraphQLModules } from './graphql/graphql.module';
import { SocketProvidersModule } from './socket-provider/socket-provider.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    MongooseModule,
    // TypeOrmModule,
    I18NextModule,
    GraphQLModule,
    ConfigModule,
    IORedisModule,
    ApisModules,
    JwtModule,
    GraphQLModules,
    SocketModule,
    SocketProvidersModule
    // MediaStreamModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
