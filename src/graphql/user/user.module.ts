import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserResolver, UserService],
  exports: [MongooseModule]
})
export class UserModule {}
