import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

import { ConfigService } from '@lib/configs';
import { IORedisConfig } from '@lib/ioredis/ioredis.dto';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor!: ReturnType<typeof createAdapter>;

  constructor(
    app: INestApplication,
    private config: ConfigService
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const configDto = this.config.validate(RedisIoAdapter.name, IORedisConfig);

    const pubClient = createClient({
      socket: {
        host: configDto.REDIS_HOST,
        port: configDto.REDIS_PORT
      },
      password: configDto.REDIS_AUTH_PASS,
      database: 0
    });

    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
