import { IsNotEmpty, IsString } from 'class-validator';

export class HttpConfigDto {
  @IsNotEmpty()
  @IsString()
  HTTP_REQUEST_ENDPOINT!: string;

  @IsNotEmpty()
  @IsString()
  HTTP_API_USER!: string;

  @IsNotEmpty()
  @IsString()
  HTTP_API_SECRET_KEY!: string;
}
