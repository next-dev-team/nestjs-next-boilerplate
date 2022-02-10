import { Logger } from '@nestjs/common';
import * as Amqp from 'amqplib';

import { ConfigService } from '@lib/config';

import { RABBIT_MQ_TOKEN } from './rabbitmq.constant';
import { RabbitMqConfig } from './rabbitmq.dto';

// import { RabbitMqConfig } from './rabbitmq.dto';

let conn: Amqp.Connection;

const logger = new Logger('RabbitMQModule');

export const RabbitMqProvider = {
  inject: [ConfigService],
  provide: RABBIT_MQ_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const config = configService.validate('RabbitMQModule', RabbitMqConfig);

    if (conn) return conn;

    conn = await Amqp.connect(config.RABBIT_MQ_HOST);
    logger.log('RabbitMQ Connected');
    return conn;
  }
};
