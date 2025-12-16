# Telegram Invoice Bot

This bot automatically detects and tracks invoices from Telegram group messages.

## Architecture

The Telegram bot is implemented as a **singleton lib module** following the same pattern as other core libraries (IORedis, Mongoose, JWT, etc.). It:

- Initializes once when the application starts
- Runs globally across the application
- Can be injected into any service using `@InjectTelegramBot()`

## Features

- 🤖 Automatic invoice detection and parsing
- 💾 Stores invoices in MongoDB
- 📊 Generates summaries (daily, weekly, monthly)
- 📈 Provides statistics and analytics
- ✅ Confirms saved invoices with reactions

## Setup

1. **Environment Variables**
   - Your bot token is already configured in `.env`
   - Optional: Add `TELEGRAM_ADMIN_ID` for admin-only commands

2. **Start MongoDB**

   ```bash
   # Make sure MongoDB is running
   # Default: mongodb://localhost:27017
   ```

3. **Run the Bot**
   ```bash
   npm run dev
   ```

## Bot Commands

- `/start` - Introduction and help
- `/summary` - Get summary of last 50 invoices
- `/today` - Today's invoices and total
- `/week` - This week's invoices grouped by day
- `/month` - This month's invoices grouped by payer
- `/stats` - Overall statistics and top payers

## How It Works

1. **Automatic Detection**: The bot listens to all messages in the group
2. **Smart Parsing**: Detects invoice patterns like:
   ```
   $24.00 paid by HUENG SREYMACH (*208) on Dec 11, 12:01 PM via ABA PAY at Cambodiamark by L.RIM. Trx. ID: 176542930423491, APV: 875362
   ```
3. **Data Extraction**: Extracts:
   - Amount and currency
   - Payer name and reference
   - Payment date and time
   - Payment method (e.g., ABA PAY)
   - Merchant and cashier
   - Transaction ID and approval code
4. **Storage**: Saves to MongoDB with chat context
5. **Confirmation**: Reacts with ✅ to confirm the invoice was saved

## Invoice Schema

Each invoice stores:

- Financial details (amount, currency, payer)
- Payment information (method, merchant, transaction ID)
- Telegram metadata (message ID, chat ID, user info)
- Timestamps (created, updated)

## File Structure

```
src/lib/telegram/                # Telegram bot lib module
├── telegram.constant.ts         # Injection tokens
├── telegram.decorator.ts        # @InjectTelegramBot() decorator
├── telegram.dto.ts              # Configuration validation
├── telegram.module.ts           # Global module registration
├── telegram.provider.ts         # Bot singleton provider & handlers
├── telegram.example.ts          # Usage example
└── index.ts                     # Exports

src/schemas/
└── invoice.schema.ts            # Invoice data model

src/common/utils/
└── invoice-parser.util.ts       # Invoice parsing logic
```

## Using the Bot in Your Services

You can inject the Telegram bot into any service using the `@InjectTelegramBot()` decorator:

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { InjectTelegramBot, TelegramBotService } from '@lib/telegram';

@Injectable()
export class YourService {
constructor(
@InjectTelegramBot()
private readonly telegramBot: TelegramBotService
) {}

async sendCustomMessage(chatId: string) {
await this.telegramBot.sendMessage(chatId, 'Hello from your service!');
}
}
\`\`\`

The bot is automatically available globally - no need to import the module in your feature modules.

## Adding to Group

1. Add bot to your Telegram group: [@YourBotName](https://t.me/YourBotName)
2. Grant admin permissions (optional, for message reactions)
3. Start sending invoices - they'll be automatically tracked!

## Customization

### Add New Invoice Formats

Edit `invoice-parser.util.ts` to support different formats:

```typescript
static parseInvoice(text: string) {
  // Add your custom parsing logic
}
```

### Add Custom Commands

Edit `telegram.service.ts` to add new commands:

```typescript
this.bot.command('yourcommand', async ctx => {
  // Your logic here
});
```

## Troubleshooting

**Bot not responding?**

- Check MongoDB is running
- Verify `TELEGRAM_BOT_TOKEN` in `.env`
- Check logs for errors

**Invoices not being detected?**

- Make sure the message format matches the parser pattern
- Check if bot has permission to read messages
- Review logs for parsing errors

## Next Steps

- [ ] Add export functionality (CSV/Excel)
- [ ] Add invoice categories
- [ ] Add user permissions
- [ ] Add webhook support for production
- [ ] Add invoice editing/deletion
