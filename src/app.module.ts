import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// Lib modules
import { MongooseGlobalModule } from '@lib/mongoose';
import { ConfigsModule } from '@lib/configs';
import { JWTModule } from '@lib/jwt';
import { I18NextModule } from '@lib/i18next';
import { IORedisModule } from '@lib/ioredis';

// API modules
import { AuthModule } from '@api/auth/auth.module';
import { UsersModule } from '@api/users/users.module';
import { MailModule } from '@api/mail/mail.module';
import { FileModule } from '@api/file/file.module';
import { HealthModule } from '@api/health/health.module';

// Event modules
import { EventsModule } from '@events/events.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10) * 1000,
        limit: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
      }
    ]),

    // Core lib modules
    ConfigsModule,
    MongooseGlobalModule,
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
