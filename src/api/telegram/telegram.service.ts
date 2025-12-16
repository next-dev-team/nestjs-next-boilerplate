import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Context } from 'telegraf';
import { Invoice, InvoiceDocument } from '@schemas';
import { UTIL } from '@common';
import { InjectTelegramBot, TelegramBotService } from '@lib/telegram';

const { InvoiceParserUtil } = UTIL;

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @InjectTelegramBot()
    private readonly telegramBot: TelegramBotService,
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>
  ) {}

  async onModuleInit() {
    this.setupBotHandlers();
    await this.setupBotCommands();
    this.logger.log('✅ Bot handlers registered - Ready to work in groups!');
  }

  private async setupBotCommands() {
    const bot = this.telegramBot.getBot();

    try {
      await bot.telegram.setMyCommands([
        { command: 'start', description: '🤖 Start the bot and see available commands' },
        { command: 'summary', description: '📊 Get invoice summary' },
        { command: 'today', description: "📅 View today's invoices" },
        { command: 'week', description: "📆 View this week's invoices" },
        { command: 'month', description: "🗓️ View this month's invoices" },
        { command: 'stats', description: '📈 View invoice statistics' }
      ]);
      this.logger.log('Bot commands and menu configured for groups');
    } catch (error) {
      this.logger.error('Failed to set bot commands', error);
    }
  }

  private setupBotHandlers() {
    const bot = this.telegramBot.getBot();

    // Start command
    bot.command('start', ctx => {
      ctx.reply(
        '👋 Hello! I am your invoice tracker bot.\n\n' +
          'I will automatically detect and save invoices from your group messages.\n\n' +
          'Commands:\n' +
          '/summary - Get invoice summary\n' +
          "/today - Today's invoices\n" +
          "/week - This week's invoices\n" +
          "/month - This month's invoices\n" +
          '/stats - View statistics'
      );
    });

    // Summary command
    bot.command('summary', async ctx => {
      await this.handleSummaryCommand(ctx);
    });

    // Today's invoices
    bot.command('today', async ctx => {
      await this.handleTodayCommand(ctx);
    });

    // This week's invoices
    bot.command('week', async ctx => {
      await this.handleWeekCommand(ctx);
    });

    // This month's invoices
    bot.command('month', async ctx => {
      await this.handleMonthCommand(ctx);
    });

    // Statistics
    bot.command('stats', async ctx => {
      await this.handleStatsCommand(ctx);
    });

    // Listen to all text messages in groups
    bot.on('text', async ctx => {
      await this.handleTextMessage(ctx);
    });

    // Error handling
    bot.catch((err, ctx) => {
      this.logger.error(`Error for ${ctx.updateType}`, err);
    });

    this.logger.log('Bot commands and handlers configured for groups');
  }

  async handleTextMessage(ctx: Context) {
    try {
      if (!ctx.message || !('text' in ctx.message)) return;

      const text = ctx.message.text;

      if (!text || text.startsWith('/')) return;

      // Check if message looks like an invoice
      if (!InvoiceParserUtil.isInvoiceMessage(text)) return;

      // Parse the invoice
      const parsed = InvoiceParserUtil.parseInvoice(text);

      if (!parsed) {
        this.logger.debug('Failed to parse invoice from message');
        return;
      }

      // Check if invoice already exists in this chat/group
      const chatId = ctx.chat?.id.toString();
      if (parsed.transactionId && chatId) {
        const existingInvoice = await this.invoiceModel.findOne({
          transactionId: parsed.transactionId,
          telegramChatId: chatId
        });

        if (existingInvoice) {
          this.logger.debug(`Invoice already exists in this group: ${parsed.transactionId}`);
          return;
        }
      }

      // Save to database
      const invoice = new this.invoiceModel({
        ...parsed,
        rawMessage: text,
        chatHistory: {
          messageId: ctx.message.message_id,
          from: {
            id: ctx.from?.id,
            firstName: ctx.from?.first_name,
            lastName: ctx.from?.last_name,
            username: ctx.from?.username,
            isBot: ctx.from?.is_bot
          },
          chat: {
            id: ctx.chat?.id,
            type: ctx.chat?.type,
            title: (ctx.chat as any)?.title
          },
          date: ctx.message.date,
          text: text
        },
        telegramMessageId: ctx.message.message_id,
        telegramChatId: ctx.chat?.id.toString(),
        telegramUserId: ctx.from?.id,
        telegramUsername: ctx.from?.username,
        isProcessed: true
      });

      await invoice.save();

      this.logger.log(`Invoice saved: ${parsed.amount} ${parsed.currency} from ${parsed.payer}`);
    } catch (error) {
      this.logger.error('Error handling text message', error);
    }
  }

  async handleSummaryCommand(ctx: Context) {
    try {
      const chatId = ctx.chat?.id.toString();

      const invoices = await this.invoiceModel
        .find({
          telegramChatId: chatId
        })
        .sort({ paymentDate: -1 })
        .limit(50);

      if (invoices.length === 0) {
        await ctx.reply('No invoices found in this chat.');
        return;
      }

      const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const currency = invoices[0]?.currency || 'USD';

      let message = `📊 Invoice Summary (Last 50)\n\n`;
      message += `Total: ${InvoiceParserUtil.formatAmount(total, currency)}\n`;
      message += `Count: ${invoices.length}\n\n`;

      message += `Recent invoices:\n`;
      invoices.slice(0, 10).forEach((inv, idx) => {
        const date = new Date(inv.paymentDate).toLocaleDateString();
        message += `${idx + 1}. ${InvoiceParserUtil.formatAmount(inv.amount, inv.currency)} - ${inv.payer} (${date})\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      this.logger.error('Error in summary command', error);
      await ctx.reply('Error generating summary. Please try again.');
    }
  }

  async handleTodayCommand(ctx: Context) {
    try {
      const chatId = ctx.chat?.id.toString();
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const invoices = await this.invoiceModel
        .find({
          telegramChatId: chatId,
          paymentDate: { $gte: startOfDay }
        })
        .sort({ paymentDate: -1 });

      if (invoices.length === 0) {
        await ctx.reply('No invoices found for today.');
        return;
      }

      const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const currency = invoices[0]?.currency || 'USD';

      let message = `📅 Today's Invoices\n\n`;
      message += `Total: ${InvoiceParserUtil.formatAmount(total, currency)}\n`;
      message += `Count: ${invoices.length}\n\n`;

      invoices.forEach((inv, idx) => {
        const time = new Date(inv.paymentDate).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        message += `${idx + 1}. ${InvoiceParserUtil.formatAmount(inv.amount, inv.currency)} - ${inv.payer} (${time})\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      this.logger.error('Error in today command', error);
      await ctx.reply("Error fetching today's invoices.");
    }
  }

  async handleWeekCommand(ctx: Context) {
    try {
      const chatId = ctx.chat?.id.toString();
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const invoices = await this.invoiceModel
        .find({
          telegramChatId: chatId,
          paymentDate: { $gte: startOfWeek }
        })
        .sort({ paymentDate: -1 });

      if (invoices.length === 0) {
        await ctx.reply('No invoices found for this week.');
        return;
      }

      const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const currency = invoices[0]?.currency || 'USD';

      // Group by day
      const byDay = new Map<string, typeof invoices>();
      invoices.forEach(inv => {
        const day = new Date(inv.paymentDate).toLocaleDateString();
        if (!byDay.has(day)) byDay.set(day, []);
        byDay.get(day)!.push(inv);
      });

      let message = `📅 This Week's Invoices\n\n`;
      message += `Total: ${InvoiceParserUtil.formatAmount(total, currency)}\n`;
      message += `Count: ${invoices.length}\n\n`;

      byDay.forEach((dayInvoices, day) => {
        const dayTotal = dayInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        message += `${day}: ${InvoiceParserUtil.formatAmount(dayTotal, currency)} (${dayInvoices.length})\n`;
      });

      await ctx.reply(message);
    } catch (error) {
      this.logger.error('Error in week command', error);
      await ctx.reply("Error fetching this week's invoices.");
    }
  }

  async handleMonthCommand(ctx: Context) {
    try {
      const chatId = ctx.chat?.id.toString();
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const invoices = await this.invoiceModel
        .find({
          telegramChatId: chatId,
          paymentDate: { $gte: startOfMonth }
        })
        .sort({ paymentDate: -1 });

      if (invoices.length === 0) {
        await ctx.reply('No invoices found for this month.');
        return;
      }

      const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
      const currency = invoices[0]?.currency || 'USD';

      // Group by payer
      const byPayer = new Map<string, typeof invoices>();
      invoices.forEach(inv => {
        if (!byPayer.has(inv.payer)) byPayer.set(inv.payer, []);
        byPayer.get(inv.payer)!.push(inv);
      });

      let message = `📅 This Month's Invoices\n\n`;
      message += `Total: ${InvoiceParserUtil.formatAmount(total, currency)}\n`;
      message += `Count: ${invoices.length}\n\n`;

      message += `By Payer:\n`;
      Array.from(byPayer.entries())
        .sort((a, b) => {
          const totalA = a[1].reduce((sum, inv) => sum + inv.amount, 0);
          const totalB = b[1].reduce((sum, inv) => sum + inv.amount, 0);
          return totalB - totalA;
        })
        .forEach(([payer, payerInvoices]) => {
          const payerTotal = payerInvoices.reduce((sum, inv) => sum + inv.amount, 0);
          message += `• ${payer}: ${InvoiceParserUtil.formatAmount(payerTotal, currency)} (${payerInvoices.length})\n`;
        });

      await ctx.reply(message);
    } catch (error) {
      this.logger.error('Error in month command', error);
      await ctx.reply("Error fetching this month's invoices.");
    }
  }

  async handleStatsCommand(ctx: Context) {
    try {
      const chatId = ctx.chat?.id.toString();

      const [totalCount, totalAmount, topPayers] = await Promise.all([
        this.invoiceModel.countDocuments({ telegramChatId: chatId }),
        this.invoiceModel.aggregate([
          { $match: { telegramChatId: chatId } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        this.invoiceModel.aggregate([
          { $match: { telegramChatId: chatId } },
          { $group: { _id: '$payer', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
          { $limit: 5 }
        ])
      ]);

      const total = totalAmount[0]?.total || 0;

      let message = `📈 Statistics\n\n`;
      message += `Total Invoices: ${totalCount}\n`;
      message += `Total Amount: $${total.toFixed(2)}\n\n`;

      if (topPayers.length > 0) {
        message += `Top Payers:\n`;
        topPayers.forEach((payer, idx) => {
          message += `${idx + 1}. ${payer._id}: $${payer.total.toFixed(2)} (${payer.count})\n`;
        });
      }

      await ctx.reply(message);
    } catch (error) {
      this.logger.error('Error in stats command', error);
      await ctx.reply('Error fetching statistics.');
    }
  }

  async sendMessage(chatId: string, message: string) {
    return this.telegramBot.sendMessage(chatId, message);
  }
}
