import { Injectable } from '@nestjs/common';
import * as nats from 'nats';

import { InjectNats } from '.';

@Injectable()
export class NatsService {
  constructor(@InjectNats() private client: nats.NatsConnection) {
    this.subscribe();
    this.publish();
  }
  private async subscribe() {
    const sc = nats.StringCodec();
    const sub = this.client.subscribe('samples');
    for await (const s of sub) {
      const res = sc.decode(s.data);
      console.log('result: ', res);
    }
  }

  async publish() {
    const sc = nats.StringCodec();
    this.client.publish('samples', sc.encode('hello world'));
  }
}
