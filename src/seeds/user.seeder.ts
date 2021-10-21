import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import * as userData from './user.json';

const logger = new Logger('DatabaseSeeder');

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async seed(): Promise<any> {
    logger.log('🌱 Start seeding...');

    try {
      await this.userModel.create(userData);

      logger.log('✔️\tSeed user successfully');
    } catch (e) {
      //@ts-ignore
      logger.error(`❌\tSeed user error: ${e.message}`);
    }

    return true;
  }

  async drop(): Promise<any> {
    logger.log('🔥 Cleared collection');
    return this.userModel.deleteMany({});
  }

  // private async genUser(): Promise<Record<string, FactoryValue>[]> {
  //   const docs = DataFactory.createForClass(User).generate(userData.length, userData);
  //   return docs;
  // }
}
