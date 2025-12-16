import { Global, Module } from '@nestjs/common';
import { TelegramProvider } from './telegram.provider';

@Global()
@Module({
  providers: [TelegramProvider],
  exports: [TelegramProvider]
})
export class TelegramModule {}
