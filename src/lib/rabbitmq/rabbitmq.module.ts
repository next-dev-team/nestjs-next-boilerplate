import { Global, Module } from '@nestjs/common';

import { RabbitMqProvider } from './rabbitmq.provider';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  providers: [RabbitMqProvider, RabbitMQService],
  exports: [RabbitMqProvider, RabbitMQService]
})
export class RabbitMQModule {}
