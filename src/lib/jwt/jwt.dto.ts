import { IsNotEmpty, IsString } from 'class-validator';

export class JWTConfig {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET!: string;

  @IsNotEmpty()
  @IsString()
  JWT_ACCESS_EXPIRATION!: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_EXPIRATION!: string;
}
