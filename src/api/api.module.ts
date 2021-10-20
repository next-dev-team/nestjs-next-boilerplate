import { Module } from '@nestjs/common';

import { I18NextController } from './i18next/i18next.controller';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // --
    UploadsModule
  ],
  controllers: [I18NextController]
})
export class ApisModules {}
