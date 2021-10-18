import { Global, Module } from '@nestjs/common';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';

import { MongooseService } from './mongoose.service';

@Global()
@Module({
  imports: [_MongooseModule.forRootAsync({ useClass: MongooseService })],
  exports: [_MongooseModule]
})
export class MongooseModule {}
