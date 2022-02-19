import { Global, Module } from '@nestjs/common';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import * as schemas from '@schemas';

import { MongooseService } from './mongoose.service';

@Global()
@Module({
  imports: [
    _MongooseModule.forRootAsync({ useClass: MongooseService }),
    _MongooseModule.forFeature([
      ...(Object.keys(schemas)
        .filter(v => !v.includes('Schema'))
        .map(ele => ({ name: schemas[ele].name, schema: schemas[`${ele}Schema`] })) as { name: string; schema: any }[])
    ])
  ],
  exports: [_MongooseModule]
})
export class MongooseModule {}
