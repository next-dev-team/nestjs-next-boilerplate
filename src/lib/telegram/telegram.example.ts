import { Injectable } from '@nestjs/common';
import { InjectTelegramBot, TelegramBotService } from '@lib/telegram';

/**
 * Example service showing how to use the Telegram Bot in your own services
 */
@Injectable()
export class ExampleService {
  constructor(
    @InjectTelegramBot()
    private readonly telegramBot: TelegramBotService
  ) {}

  async sendNotificationToChat(chatId: string, message: string) {
    // Use the telegram bot to send messages
    await this.telegramBot.sendMessage(chatId, message);
  }

  async notifyAboutNewInvoice(chatId: string, amount: number, payer: string) {
    const message = `🔔 New invoice detected!\n\nAmount: $${amount}\nPayer: ${payer}`;
    await this.telegramBot.sendMessage(chatId, message);
  }
}
