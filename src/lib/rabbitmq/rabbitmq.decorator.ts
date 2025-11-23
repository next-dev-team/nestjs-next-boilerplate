import { Inject } from '@nestjs/common';

import { RABBIT_MQ_TOKEN } from './rabbitmq.constant';

export const InjectRabbitMQ = () => Inject(RABBIT_MQ_TOKEN);
