import { IsNotEmpty, IsString } from 'class-validator';

export class MqttConfig {
  @IsNotEmpty()
  @IsString()
  MQTT_HOST!: string;

  MQTT_USERNAME!: string;

  MQTT_PASSWORD!: string;
}
