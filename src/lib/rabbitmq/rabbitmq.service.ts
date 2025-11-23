import { Injectable, Logger } from '@nestjs/common';
import * as Amqp from 'amqplib';

import { InjectRabbitMQ } from './rabbitmq.decorator';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private retryCount = 0;
  private maxRetry = 5;
  private channel?: Amqp.Channel | null;

  constructor(@InjectRabbitMQ() private readonly connection: Amqp.Connection) {
    this.getChannel();
  }

  async getChannel(): Promise<Amqp.Channel> {
    if (this.channel) return this.channel;
    this.channel = await (this.connection as any).createChannel();
    return this.channel!;
  }

  async sendToQueue(messageKey: string, messagePayload: string | object): Promise<boolean> {
    try {
      const channel = await this.getChannel();
      const payload = typeof messagePayload === 'string' ? messagePayload : JSON.stringify(messagePayload);

      // Make sure that the queue will survive a RabbitMQ node restart
      await channel.assertQueue(messageKey, {
        durable: true
      });

      channel.sendToQueue(messageKey, Buffer.from(payload), {
        persistent: true // Make sure queue won't be lost even if RabbitMQ restarts
      });

      this.retryCount = 0;

      //! No need close cuz channel create only one time (singleton)
      //! If want to close need recreate channel every call this function
      // await channel.close();
      // await this.connection.close();
    } catch (e: any) {
      this.logger.error(e.message);
      if (e.message === 'Channel closed') {
        this.channel = await (this.connection as any).createChannel();
        // Recursive retry
        if (this.retryCount < this.maxRetry) {
          this.retryCount++;
          await this.sendToQueue(messageKey, messagePayload);
        }
      }
    }
    return true;
  }

  async consumeQueue(
    queueName: string,
    callback: (message: string) => void | Promise<void>,
    options: { prefetch?: number; noAck?: boolean } = {}
  ): Promise<void> {
    const { prefetch = 1, noAck = false } = options;

    try {
      const channel = await this.getChannel();

      await channel.assertQueue(queueName, {
        durable: true
      });

      channel.prefetch(prefetch);

      channel.consume(
        queueName,
        async msg => {
          if (msg) {
            try {
              const content = msg.content.toString();
              await callback(content);

              if (!noAck) {
                channel.ack(msg);
              }
            } catch (error: any) {
              this.logger.error(`Error processing message: ${error.message}`);
              // Reject and requeue the message
              channel.nack(msg, false, true);
            }
          }
        },
        { noAck }
      );

      this.logger.log(`Started consuming from queue: ${queueName}`);
    } catch (error: any) {
      this.logger.error(`Error consuming queue: ${error.message}`);
      throw error;
    }
  }

  async publishToExchange(
    exchangeName: string,
    routingKey: string,
    message: string | object,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'direct'
  ): Promise<boolean> {
    try {
      const channel = await this.getChannel();
      const payload = typeof message === 'string' ? message : JSON.stringify(message);

      await channel.assertExchange(exchangeName, exchangeType, {
        durable: true
      });

      channel.publish(exchangeName, routingKey, Buffer.from(payload), {
        persistent: true
      });

      this.logger.log(`Published to exchange: ${exchangeName} with routing key: ${routingKey}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Error publishing to exchange: ${error.message}`);
      throw error;
    }
  }

  async subscribeToExchange(
    exchangeName: string,
    routingKey: string,
    callback: (message: string) => void | Promise<void>,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'direct',
    options: { prefetch?: number; noAck?: boolean } = {}
  ): Promise<void> {
    const { prefetch = 1, noAck = false } = options;

    try {
      const channel = await this.getChannel();

      await channel.assertExchange(exchangeName, exchangeType, {
        durable: true
      });

      const { queue } = await channel.assertQueue('', {
        exclusive: true
      });

      await channel.bindQueue(queue, exchangeName, routingKey);

      channel.prefetch(prefetch);

      channel.consume(
        queue,
        async msg => {
          if (msg) {
            try {
              const content = msg.content.toString();
              await callback(content);

              if (!noAck) {
                channel.ack(msg);
              }
            } catch (error: any) {
              this.logger.error(`Error processing message: ${error.message}`);
              channel.nack(msg, false, true);
            }
          }
        },
        { noAck }
      );

      this.logger.log(`Subscribed to exchange: ${exchangeName} with routing key: ${routingKey}`);
    } catch (error: any) {
      this.logger.error(`Error subscribing to exchange: ${error.message}`);
      throw error;
    }
  }
}
