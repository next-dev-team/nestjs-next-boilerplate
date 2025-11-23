import { Global, Module } from '@nestjs/common';
import { MongooseModule as _MongooseModule } from '@nestjs/mongoose';
import * as schemas from '../../schemas';

import { MongooseProvider } from './mongoose.provider';

@Global()
@Module({
  imports: [
    _MongooseModule.forRootAsync({ useClass: MongooseProvider }),
    _MongooseModule.forFeature([
      ...(Object.keys(schemas)
        .filter(v => !v.includes('Schema') && !v.includes('Document') && !v.includes('Model') && v !== 'BaseCreation')
        .map(ele => ({ name: schemas[ele].name, schema: schemas[`${ele}Schema`] }))
        .filter(v => v.schema) as { name: string; schema: any }[])
    ])
  ],
  providers: [],
  exports: [_MongooseModule]
})
export class MongooseModule {}
