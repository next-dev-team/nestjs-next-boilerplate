import { Logger } from '@nestjs/common';
import * as nats from 'nats';

import { ConfigService } from '@lib/config';

import { NATS_TOKEN } from './nats.constant';
import { NatsConfig } from './nats.dto';

let conn: nats.NatsConnection;

const logger = new Logger('NatsModule');

export const NatsProvider = {
  inject: [ConfigService],
  provide: NATS_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const config = configService.validate('NatsModule', NatsConfig);
    if (conn) return conn;
    conn = await nats.connect({ servers: config.NATS_HOST });
    logger.log('NATS Connected');
    return conn;
  }
};
