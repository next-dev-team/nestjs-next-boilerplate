import { Module } from '@nestjs/common';

// Lib modules
import { MongooseModule } from '@lib/mongoose';
import { ConfigModule } from '@lib/configs';
import { JWTModule } from '@lib/jwt';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';

// API modules
import { ApiModule } from '@api/api.module';
import { EventsModule } from '@events';
import { LoggerModule } from '@lib/logger/logger.module';
import { TelegramModule } from '@lib/telegram';

@Module({
  imports: [
    // Core lib modules
    ConfigModule,
    MongooseModule,
    JWTModule,
    I18NextModule,
    IORedisModule,
    LoggerModule,
    TelegramModule,

    // API modules
    ApiModule,

    // WebSocket
    EventsModule
  ]
})
export class AppModule {}
