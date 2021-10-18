import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

import { ConfigService } from '@lib/config';

import { MongooseConfig } from './mongoose.dto';

@Injectable()
export class MongooseService implements MongooseOptionsFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const config = this.configService.validate('MongooseModule', MongooseConfig);
    return {
      uri: config.MONGO_DB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };
  }
}
