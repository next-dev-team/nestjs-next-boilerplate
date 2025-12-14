import { Module } from '@nestjs/common';

// Lib modules
import { MongooseModule } from '@lib/mongoose';
import { TypeOrmModule } from '@lib/typeorm';
import { ConfigModule } from '@lib/configs';
import { JWTModule } from '@lib/jwt';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';

// API modules
import { ApiModule } from '@api/api.module';
import { EventsModule } from '@events';
import { LoggerModule } from '@lib/logger/logger.module';

@Module({
  imports: [
    // Core lib modules
    ConfigModule,
    MongooseModule,
    TypeOrmModule,
    JWTModule,
    I18NextModule,
    IORedisModule,
    LoggerModule,

    // API modules
    ApiModule,

    // WebSocket
    EventsModule
  ]
})
export class AppModule {}
