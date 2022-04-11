import { initTracer } from 'jaeger-client';

const config = {
  serviceName: process.env.JAEGER_SERVICE_NAME,
  sampler: {
    type: 'const',
    param: 1
  },
  reporter: {
    logSpans: false, // enable jaeger logs, to turn off just assign false
    collectorEndpoint: process.env.JAEGER_ENDPOINT
  }
};
const options = {
  // enable logger
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    info() {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error() {}
  }
};

export const tracer = initTracer(config, options);
