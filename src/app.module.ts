import { Module } from '@nestjs/common';

// Lib modules
import { MongooseModule } from '@lib/mongoose';
import { ConfigModule } from '@lib/configs';
import { JWTModule } from '@lib/jwt';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';
import { ThrottlerModule } from '@lib/throttler';

// API modules
import { AuthModule } from '@api/auth/auth.module';
import { UsersModule } from '@api/users/users.module';
import { MailModule } from '@api/mail/mail.module';
import { FileModule } from '@api/file/file.module';
import { HealthModule } from '@api/health/health.module';
import { EventsModule } from '@events';

@Module({
  imports: [
    // Core lib modules
    ConfigModule,
    ThrottlerModule,
    MongooseModule,
    JWTModule,
    I18NextModule,
    IORedisModule,

    // API modules
    AuthModule,
    UsersModule,
    MailModule,
    FileModule,
    HealthModule,

    // WebSocket
    EventsModule
  ]
})
export class AppModule {}
