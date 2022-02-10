import { Global, Module } from '@nestjs/common';

import { RabbitMqProvider } from './rabbitmq.provider';

@Global()
@Module({
  providers: [RabbitMqProvider],
  exports: [RabbitMqProvider]
})
export class RabbitMQModule {}
