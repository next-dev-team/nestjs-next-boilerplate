import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { ConfigModule } from '@lib/config';
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
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql', //join(process.cwd(), 'src/schema.gql'),
      //typePaths: ['./**/*.gql'],
      //fieldResolverEnhancers: ['interceptors'],
      introspection: true,
      debug: true,
      //installSubscriptionHandlers: true,
      formatError: (error: GraphQLError) => {
        const responseError = {} as {
          statusCode: number;
          message: string;
          error: string;
          stacktrace: any[];
        };
        const ext = error.extensions;
        const statusCode = ext?.response?.statusCode || 500;
        let message = ext?.response?.message || 'Internal server error';
        message = Array.isArray(message) ? message[0] : message;
        const errors = ext?.response?.error || 'Internal Server Error';
        const stacktrace = ext?.exception?.stacktrace || [];
        responseError.statusCode = statusCode;
        responseError.message = message;
        responseError.error = errors;
        responseError.stacktrace = stacktrace;
        return responseError;
      },
      context: ({ req }) => ({ req })
    }),

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
