import { Global, Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [_ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  providers: [ConfigService],
  exports: [ConfigService]
})
export class ConfigModule {}
