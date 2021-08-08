import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ConfigDto {
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsNotEmpty()
  // @IsNumber()
  @Transform(x => +x)
  PORT!: number;

  @IsNotEmpty()
  JWT_SECRET!: string;
}
