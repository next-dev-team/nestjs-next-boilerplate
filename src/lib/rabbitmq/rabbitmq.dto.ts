import { IsNotEmpty, IsString } from 'class-validator';

export class RabbitMqConfig {
  @IsNotEmpty()
  @IsString()
  RABBIT_MQ_HOST!: string;
}
