import { Module } from '@nestjs/common';

import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // --
    UploadsModule
  ]
})
export class ApisModules {}
