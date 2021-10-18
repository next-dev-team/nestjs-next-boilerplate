import { IsNotEmpty, IsString } from 'class-validator';

export class MongooseConfig {
  @IsNotEmpty()
  @IsString()
  MONGO_DB_URI!: string;
}
