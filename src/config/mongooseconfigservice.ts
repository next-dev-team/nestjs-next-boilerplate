import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      // uri: `mongodb://${this.configService.get('database.user')?this.configService.get('database.user')+':'+this.configService.get('database.pwd')+'@':''}${this.configService.get('database.host')}:${this.configService.get('database.port')}/${this.configService.get('database.name')}`,
      uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.xvj0s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };
  }
}
