import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { ConfigModule } from '@lib/config';
import { IORedisModule } from '@lib/ioredis';
import { JwtModule } from '@lib/jwt';
import { MongooseModule } from '@lib/mongoose';

import { ApisModules } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import configuration from './config/configuration';
import { EmailsModule } from './emails/emails.module';
import { GraphQLModules } from './graphql/graphql.module';
import { HelpersModule } from './helpers/helpers.module';
import { AuthMiddleware } from './shared/auth.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    MongooseModule,
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
    EmailsModule,
    JwtModule,
    GraphQLModules
  ],
  controllers: [AppController],
  providers: [
    AppService
    // IORedisService,
    // { provide: APP_FILTER, useClass: AppExceptionFilter },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // }
  ]
})
//export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      //.exclude({path: '/api/login', method: RequestMethod.POST})
      //.exclude({ path: 'user', method.mutations: 'test'})
      .forRoutes('graphql');
  }
}
