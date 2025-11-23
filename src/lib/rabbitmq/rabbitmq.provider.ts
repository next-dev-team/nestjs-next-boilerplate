import { Logger } from '@nestjs/common';
import * as Amqp from 'amqplib';

import { ConfigService } from '@lib/configs';

import { RABBIT_MQ_TOKEN } from './rabbitmq.constant';
import { RabbitMqConfig } from './rabbitmq.dto';

let conn: Amqp.Connection | null = null;
let isConnecting = false;

const logger = new Logger('RabbitMQModule');

const MAX_RETRY = 5;
const RETRY_DELAY = 5000; // 5 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry(host: string, retryCount = 0): Promise<any> {
  try {
    logger.log(`Attempting to connect to RabbitMQ... (Attempt ${retryCount + 1}/${MAX_RETRY + 1})`);
    const connection = await Amqp.connect(host);
    logger.log('RabbitMQ Connected successfully');

    // Handle connection errors and reconnection
    connection.on('error', async (err: any) => {
      logger.error(`RabbitMQ connection error: ${err.message}`);
      conn = null;
      isConnecting = false;
    });

    connection.on('close', async () => {
      logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
      conn = null;
      isConnecting = false;
      // Attempt to reconnect after delay
      await sleep(RETRY_DELAY);
      try {
        conn = await connectWithRetry(host);
      } catch (error: any) {
        logger.error(`Failed to reconnect to RabbitMQ: ${error.message}`);
      }
    });

    return connection;
  } catch (error: any) {
    logger.error(`RabbitMQ connection failed: ${error.message}`);

    if (retryCount < MAX_RETRY) {
      logger.warn(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await sleep(RETRY_DELAY);
      return connectWithRetry(host, retryCount + 1);
    }

    logger.error(`Failed to connect to RabbitMQ after ${MAX_RETRY + 1} attempts`);
    throw new Error(`Could not connect to RabbitMQ: ${error.message}`);
  }
}

export const RabbitMqProvider = {
  inject: [ConfigService],
  provide: RABBIT_MQ_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const config = configService.validate('RabbitMQModule', RabbitMqConfig);

    // Return existing connection if available
    if (conn) return conn;

    // Wait if connection is in progress
    if (isConnecting) {
      logger.log('Connection attempt already in progress, waiting...');
      while (isConnecting && !conn) {
        await sleep(100);
      }
      if (conn) return conn;
    }

    isConnecting = true;

    try {
      conn = await connectWithRetry(config.RABBIT_MQ_HOST);
      return conn;
    } finally {
      isConnecting = false;
    }
  }
};
