import { IsNotEmpty, IsString } from 'class-validator';

export class NatsConfig {
  @IsNotEmpty()
  @IsString()
  NATS_HOST!: string;

  NATS_USERNAME!: string;

  NATS_PASSWORD!: string;
}
