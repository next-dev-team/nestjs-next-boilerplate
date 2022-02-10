import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

import { InjectMqtt } from '.';

@Injectable()
export class MqttService {
  constructor(@InjectMqtt() private client: mqtt.Client) {
    this.listener();
    this.subscribe();
  }
  private async subscribe() {
    this.client.subscribe('sports/football/match.v1', function(err) {
      console.log('xxx -> subscribe', 'err?', err);
    });
  }
  private async listener() {
    this.client.on('message', function(topic, message) {
      // message is Buffer, so we need to convert to string
      console.log('xxx ->', topic, JSON.parse(message.toString()));
    });
  }
}
