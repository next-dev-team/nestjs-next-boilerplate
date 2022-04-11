import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ConfigDto {
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsNotEmpty()
  // @IsNumber()
  @Transform(x => +x)
  PORT!: number;

  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsOptional()
  JWT_EXPIRED?: string;

  @IsNotEmpty()
  ENABLE_JAEGER?: boolean;

  @IsOptional()
  JAEGER_ENDPOINT?: string;

  @IsOptional()
  JAEGER_SERVICE_NAME?: string;
}
