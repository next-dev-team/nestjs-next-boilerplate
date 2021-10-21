import { Global, Module } from '@nestjs/common';
import { GraphQLModule as _GraphQLModule } from '@nestjs/graphql';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';

@Global()
@Module({
  imports: [
    _GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql', //join(process.cwd(), 'src/schema.gql'),
      //typePaths: ['./**/*.gql'],
      //fieldResolverEnhancers: ['interceptors'],
      introspection: true,
      debug: true,
      //installSubscriptionHandlers: true,
      formatError: (error: GraphQLError) => {
        // const responseError = {} as {
        //   statusCode: number;
        //   message: string;
        //   error: string;
        //   stacktrace: any[];
        // };
        // const ext = error.extensions;
        // const statusCode = ext?.response?.statusCode || 500;
        // let message = ext?.response?.message || 'Internal server error';
        // message = Array.isArray(message) ? message[0] : message;
        // const errors = ext?.response?.error || 'Internal Server Error';
        // const stacktrace = ext?.exception?.stacktrace || [];
        // responseError.statusCode = statusCode;
        // responseError.message = message;
        // responseError.error = errors;
        // responseError.stacktrace = stacktrace;
        // return responseError;
        return {
          message: 'Http Exception',
          locations: error.locations,
          path: error.path,
          extensions: error.extensions
        };
      },
      context: ({ req }) => ({ req })
    })
  ],
  exports: [_GraphQLModule]
})
export class GraphQLModule {}
