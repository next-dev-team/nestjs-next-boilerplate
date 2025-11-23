import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

import { ConfigService } from '@lib/configs';

import { MongooseConfig } from './mongoose.dto';

@Injectable()
export class MongooseProvider implements MongooseOptionsFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const config = this.configService.validate('MongooseModule', MongooseConfig);
    return {
      uri: config.MONGO_DB_URI
    };
  }
}
