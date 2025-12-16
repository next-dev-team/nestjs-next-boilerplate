import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

// Controllers
import { HealthController } from './health/health.controller';

// Services
import { TelegramService } from './telegram/telegram.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [TelegramService],
  exports: [TelegramService]
})
export class ApiModule {}
