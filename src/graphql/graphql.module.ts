import { Module } from '@nestjs/common';

import { SamplesModule } from './samples/samples.module';

@Module({
  imports: [
    // --
    SamplesModule
  ]
})
export class GraphQLModules {}
