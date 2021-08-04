import { Injectable } from '@nestjs/common';
import { SamplesService } from 'src/graphql/samples/samples.service';

import { SampleHelperInputType, SampleHelperType } from './dto/sample.helper.dto';

@Injectable()
export class SamplesHelperService {
  constructor(private sampleSvc: SamplesService) {}
  async createSampleHelper(input: SampleHelperInputType): Promise<SampleHelperType> {
    return await this.sampleSvc.findOne({ name: input.name });
  }
}
