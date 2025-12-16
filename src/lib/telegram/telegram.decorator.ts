import { Inject } from '@nestjs/common';
import { TELEGRAM_BOT_TOKEN } from './telegram.constant';

export const InjectTelegramBot = () => Inject(TELEGRAM_BOT_TOKEN);
