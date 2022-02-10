import { Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';

import { ConfigService } from '@lib/config';

import { MQTT_TOKEN } from './mqtt.constant';
import { MqttConfig } from './mqtt.dto';

let conn: mqtt.Client;

const logger = new Logger('MqttModule');

export const MqttProvider = {
  inject: [ConfigService],
  provide: MQTT_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const config = configService.validate('MqttModule', MqttConfig);

    if (conn) return conn;

    conn = mqtt.connect(config.MQTT_HOST, { username: config.MQTT_USERNAME, password: config.MQTT_PASSWORD });
    logger.log('MQTT Connected');
    return conn;
  }
};
