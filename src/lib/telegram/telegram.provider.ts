import { Logger } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { ConfigService } from '@lib/configs';
import { TELEGRAM_BOT_TOKEN } from './telegram.constant';
import { TelegramConfig } from './telegram.dto';

const logger = new Logger('TelegramModule');

let bot: Telegraf<Context<Update>> | null = null;

export class TelegramBotService {
  private logger = new Logger(TelegramBotService.name);

  constructor(private readonly bot: Telegraf<Context<Update>>) {}

  async sendMessage(chatId: string, message: string) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error('Error sending message', error);
    }
  }

  getBot() {
    return this.bot;
  }
}

export const TelegramProvider = {
  inject: [ConfigService],
  provide: TELEGRAM_BOT_TOKEN,
  useFactory: async (configService: ConfigService) => {
    const config = configService.validate('TelegramModule', TelegramConfig);

    // Singleton pattern - prevent reinitializing bot
    if (bot) {
      logger.log('Telegram bot already initialized, returning existing instance');
      return new TelegramBotService(bot);
    }

    if (!config.TELEGRAM_BOT_TOKEN) {
      logger.error('TELEGRAM_BOT_TOKEN is not configured');
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }

    bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

    logger.log('Telegram bot instance created');
    logger.log('Launching bot...');

    // Launch bot in background (doesn't block)
    setImmediate(() => {
      bot!
        .launch()
        .then(() => {
          // This won't be called until bot stops
          logger.log('Bot stopped');
        })
        .catch(error => {
          logger.error('❌ Failed to launch bot:', error.message);
        });

      logger.log('✅ Telegram bot launched successfully');

      // Enable graceful stop
      process.once('SIGINT', () => bot?.stop('SIGINT'));
      process.once('SIGTERM', () => bot?.stop('SIGTERM'));
    });

    return new TelegramBotService(bot);
  }
};
