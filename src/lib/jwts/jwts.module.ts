import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import configuration from '../../config/configuration';
import { JwtsService } from './jwts.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        expiresIn: configService.get('jwt.expired')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [JwtsService],
  exports: [JwtModule]
})
export class JwtsModule {}
