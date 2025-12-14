import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class IORedisConfig {
  @IsNotEmpty()
  @IsString()
  REDIS_HOST!: string;

  @Transform(x => +x.value)
  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT!: number;

  @IsOptional()
  @IsString()
  REDIS_AUTH_PASS!: string;
}
