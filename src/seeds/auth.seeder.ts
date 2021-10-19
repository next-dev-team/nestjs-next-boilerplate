import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import { UserEntity } from '@entities';

import * as authData from './auth.json';

const logger = new Logger('DatabaseSeeder');

@Injectable()
export class AuthSeeder implements Seeder {
  constructor(@InjectRepository(UserEntity) private readonly user: Repository<UserEntity>) {}

  async seed(): Promise<any> {
    logger.log('🌱 Start seeding...');

    try {
      await this.user.save(authData);

      logger.log('✔️\tSeed auth successfully');
    } catch (e) {
      //@ts-ignore
      logger.error(`❌\tSeed auth error: ${e.message}`);
    }

    return true;
  }

  async drop(): Promise<any> {
    logger.log('🔥 Cleared collection');
    return this.user.delete({});
  }

  // private async genUser(): Promise<Record<string, FactoryValue>[]> {
  //   const docs = DataFactory.createForClass(User).generate(userData.length, userData);
  //   return docs;
  // }
}
