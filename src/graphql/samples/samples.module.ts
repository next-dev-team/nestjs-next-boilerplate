import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SamplesHelperService } from 'src/helpers/samples.helper.service';
import { SampleSchema } from 'src/schema.ts';

import { JwtsModule } from '@lib/jwts/jwts.module';
import { JwtsService } from '@lib/jwts/jwts.service';

import { SamplesResolver } from './samples.resolver';
import { SamplesService } from './samples.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sample', schema: SampleSchema }]), JwtsModule],
  providers: [SamplesResolver, SamplesService, JwtsService, SamplesHelperService],
  exports: [MongooseModule]
})
export class SamplesModule {}
