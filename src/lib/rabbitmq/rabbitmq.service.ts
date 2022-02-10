import { Injectable } from '@nestjs/common';
import * as Amqp from 'amqplib';

import { InjectRabbitMQ } from '@lib/rabbitmq';
@Injectable()
export class RabbitMQService {
  private retryCount = 0;
  private maxRetry = 5;
  private channel?: Amqp.Channel | null;
  constructor(@InjectRabbitMQ() private readonly connection: Amqp.Connection) {
    this.getChannel();
  }

  async getChannel(): Promise<Amqp.Channel> {
    if (this.channel) return this.channel;
    this.channel = await this.connection.createChannel();
    return this.channel;
  }

  async sendToQueue(messageKey: string, messagePayload: string) {
    try {
      const channel = await this.getChannel();
      // make sure that the queue will survive a RabbitMQ node restart
      await channel.assertQueue(messageKey, {
        durable: true
      });

      channel.sendToQueue(messageKey, Buffer.from(messagePayload), {
        persistent: true // make sure queue won't be lost even if RabbitMQ restarts
      });

      this.retryCount = 0;

      //! No need close cuz channel create only one time (singleton)
      //! If want to close need recreate channel every call this function
      // await channel.close();
      // await this.connection.close();
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
      //@ts-ignore
      if (e.message === 'Channel closed') {
        this.channel = await this.connection.createChannel();
        // Recursive
        if (this.retryCount < this.maxRetry) {
          this.retryCount++;
          await this.sendToQueue(messageKey, messagePayload);
        }
      }
    }
    return true;
  }

  //!==================== Test rabbit MQ ==============
  // private async consumeTestMsg() {
  //   const consumeKey = RABBIT_MQ_MESSAGE_KEY.TEST_KEY;
  //   this.getChannel().then(channel => {
  //     channel.assertQueue(consumeKey, {
  //       durable: true
  //     });
  //     channel.prefetch(1);
  //     channel.consume(
  //       consumeKey,
  //       async msg => {
  //         channel.ack(msg as Amqp.ConsumeMessage);
  //         if (msg) {
  //           console.log('trig rabbit mq:', String(msg.content));
  //         }
  //       },
  //       { noAck: false }
  //     );
  //   });
  // }
}
