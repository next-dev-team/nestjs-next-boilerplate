import { Inject } from '@nestjs/common';

import { MQTT_TOKEN } from './mqtt.constant';

export const InjectMqtt = () => Inject(MQTT_TOKEN);
