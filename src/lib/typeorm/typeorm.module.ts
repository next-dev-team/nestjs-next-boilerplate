import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';

import * as Entities from '@entities';

import { TypeOrmConfigService } from './typeorm.service';

@Global()
@Module({
  imports: [
    OrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    OrmModule.forFeature([...Object.values(Entities)])
  ],
  exports: [OrmModule]
})
export class TypeOrmModule {}
