import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ThrottlerConfig {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  RATE_LIMIT_TTL!: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  RATE_LIMIT_MAX!: number;
}
