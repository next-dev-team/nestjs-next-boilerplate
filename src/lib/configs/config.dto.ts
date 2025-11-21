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

  @IsNumber()
  @IsNotEmpty()
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  API_PREFIX!: string;

  // Database
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsNumber()
  @IsNotEmpty()
  DATABASE_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string;

  @IsString()
  @IsOptional()
  DATABASE_SSL?: string;

  // Mail
  @IsString()
  @IsOptional()
  MAIL_HOST?: string;

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
  @IsNumber()
  @IsOptional()
  RATE_LIMIT_TTL?: number;

  @IsNumber()
  @IsOptional()
  RATE_LIMIT_MAX?: number;
}
