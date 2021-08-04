import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';

import { AppExceptionFilter } from '@common';
import { IORedisModule } from '@lib/ioredis';

// import { IORedisModule } from '@lib/ioredis';

import { ApisModules } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { MongooseConfigService } from './config/mongooseconfigservice';
import { EmailsModule } from './emails/emails.module';
import { GraphQLModules } from './graphql/graphql.module';
import { HelpersModule } from './helpers/helpers.module';
import { IORedisController } from './ioredis/ioredis.controller';
import { IORedisService } from './ioredis/ioredis.service';
import { JwtsModule } from './lib/jwts/jwts.module';
import { PwdModule } from './pwd/pwd.module';
import { AuthMiddleware } from './shared/auth.middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql', //join(process.cwd(), 'src/schema.gql'),
      //typePaths: ['./**/*.gql'],
      //fieldResolverEnhancers: ['interceptors'],
      introspection: true,
      debug: true,
      playground: true,
      //installSubscriptionHandlers: true,
      formatError: (error: GraphQLError) => {
        const exc = error.extensions?.exception;
        let message = exc.message;
        const stacktrace = exc.stacktrace || [];
        if (!exc.status) message = { statusCode: 500, message: 'Internal server error' };
        if (exc.status && exc.status === 500) message = { statusCode: 500, message: 'Internal server error' };
        return { ...message, stacktrace };
      },

      context: ({ req }) => ({ req })
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRED }
    }),
    HelpersModule,
    // ConfigModule,
    IORedisModule,
    ApisModules,
    PwdModule,
    EmailsModule,
    JwtsModule,
    GraphQLModules
  ],
  controllers: [AppController, IORedisController],
  providers: [AppService, IORedisService, { provide: APP_FILTER, useClass: AppExceptionFilter }]
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
