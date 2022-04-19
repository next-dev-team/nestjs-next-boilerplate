import { Global, Module } from '@nestjs/common';
import { GraphQLModule as _GraphQLModule } from '@nestjs/graphql';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { gql } from 'apollo-server';
import { GraphQLError } from 'graphql';
import { Span, Tags } from 'opentracing';

import { tracer } from './plugins';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OpentracingPlugin = require('apollo-opentracing').default;

/**
 * @ref to fix issue according to tracing graphql
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49595
 * @see jaeger docker image: https://github.com/next-dev-team/jaeger-logger
 */
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
        const ext = error.extensions;
        if (ext?.response && ext.response.message && Array.isArray(ext.response.message)) {
          ext.response.message = ext.response.message[0];
        }
        const errorRes = {
          message: 'Http Exception',
          locations: error.locations,
          path: error.path,
          extensions: ext
        };

        // logging into jaeger
        //@ts-ignore
        if (global.span) {
          //@ts-ignore
          global.span.setTag(Tags.ERROR, true);
          //@ts-ignore
          global.span.log(errorRes);
        }
        return errorRes;
      },
      context: ({ req }) => ({ req }),
      plugins: [
        OpentracingPlugin({
          server: tracer,
          local: tracer,
          shouldTraceFieldResolver: () => true,
          onRequestResolve: (span: Span, info: any) => {
            const query = gql`
              ${info.request.query}
            ` as any;
            // eslint-disable-next-line prefer-destructuring
            const operation = query.definitions[0].operation;
            const operationName = query.definitions[0].selectionSet.selections[0].name.value;
            span.setOperationName(`${operation}: ${operationName}`);
            span.setBaggageItem('variable', query?.definitions[0]?.selectionSet?.selections?.[0]?.arguments?.[0] || '');
            // eslint-disable-next-line no-param-reassign
            info.context.span = span; // attach span to context
            //@ts-ignore
            global.span = span;
          }
        })
      ]
    })
  ],
  exports: [_GraphQLModule]
})
export class GraphQLModule {}
