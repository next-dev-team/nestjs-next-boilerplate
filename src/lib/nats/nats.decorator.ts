import { Inject } from '@nestjs/common';

import { NATS_TOKEN } from './nats.constant';

export const InjectNats = () => Inject(NATS_TOKEN);
