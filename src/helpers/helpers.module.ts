import { Module } from '@nestjs/common';
import { SamplesModule } from 'src/graphql/samples/samples.module';
import { SamplesService } from 'src/graphql/samples/samples.service';

import { SamplesHelperService } from './samples.helper.service';

@Module({
  imports: [SamplesModule],
  providers: [SamplesHelperService, SamplesService],
  exports: [SamplesHelperService]
})
export class HelpersModule {}
