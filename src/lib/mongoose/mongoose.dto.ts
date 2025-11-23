import { IsNotEmpty, IsString } from 'class-validator';

export class MongooseConfig {
  @IsString()
  @IsNotEmpty()
  MONGO_DB_URI!: string;
}
