import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'staging'
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsNotEmpty()
  NODE_ENV!: Environment;

  @Transform(x => +x.value)
  @IsNumber()
  @IsNotEmpty()
  PORT!: number;

  // Mail
  @IsString()
  @IsOptional()
  MAIL_HOST?: string;

  @Transform(x => +x.value)
  @IsNumber()
  @IsOptional()
  MAIL_PORT?: number;

  @IsString()
  @IsOptional()
  MAIL_USER?: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD?: string;

  @IsString()
  @IsOptional()
  MAIL_FROM?: string;

  // AWS
  @IsString()
  @IsOptional()
  AWS_ACCESS_KEY_ID?: string;

  @IsString()
  @IsOptional()
  AWS_SECRET_ACCESS_KEY?: string;

  @IsString()
  @IsOptional()
  AWS_REGION?: string;

  @IsString()
  @IsOptional()
  AWS_S3_BUCKET?: string;

  // CORS
  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;

  // Rate Limiting
  @Transform(x => +x.value)
  @IsNumber()
  @IsOptional()
  RATE_LIMIT_TTL?: number;

  @Transform(x => +x.value)
  @IsNumber()
  @IsOptional()
  RATE_LIMIT_MAX?: number;

  // Telegram Bot
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN!: string;

  @IsString()
  @IsOptional()
  TELEGRAM_ADMIN_ID?: string;
}
