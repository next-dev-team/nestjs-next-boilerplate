import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TelegramConfig {
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN!: string;

  @IsString()
  @IsOptional()
  TELEGRAM_ADMIN_ID?: string;
}
