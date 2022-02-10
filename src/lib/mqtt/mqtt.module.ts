import { Global, Module } from '@nestjs/common';

import { MqttProvider } from './mqtt.provider';

@Global()
@Module({
  providers: [MqttProvider],
  exports: [MqttProvider]
})
export class MqttModule {}
