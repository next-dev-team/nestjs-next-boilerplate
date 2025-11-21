import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { User, UserSchema, Todo, TodoSchema } from '../../schemas';
import { MongooseService } from './mongoose.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        retryWrites: true,
        w: 'majority',
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Todo.name, schema: TodoSchema }
    ])
  ],
  providers: [MongooseService],
  exports: [MongooseModule, MongooseService]
})
export class MongooseGlobalModule {}
