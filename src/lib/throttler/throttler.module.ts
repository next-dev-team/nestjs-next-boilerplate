import { Global, Module } from '@nestjs/common';
import { ThrottlerModule as _ThrottlerModule } from '@nestjs/throttler';

import { ConfigService } from '@lib/configs';

import { ThrottlerConfig } from './throttler.dto';

@Global()
@Module({
  imports: [
    _ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.validate('ThrottlerModule', ThrottlerConfig);
        return [
          {
            ttl: config.RATE_LIMIT_TTL * 1000, // Convert to milliseconds
            limit: config.RATE_LIMIT_MAX
          }
        ];
      }
    })
  ],
  exports: [_ThrottlerModule]
})
export class ThrottlerModule {}
