import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schema';
import { seeder } from 'nestjs-seeder';

import { ConfigModule } from '@lib/config';
import { MongooseModule } from '@lib/mongoose';
import { TypeOrmModule } from '@lib/typeorm';

import { UsersSeeder } from './seeds';
import { AuthSeeder } from './seeds/auth.seeder';

seeder({
  imports: [
    MongooseModule,
    TypeOrmModule,
    _MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule
  ]
}).run([UsersSeeder, AuthSeeder]);
