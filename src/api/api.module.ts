import { Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { I18NextController } from './i18next/i18next.controller';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // --
    UploadsModule
  ],
  controllers: [I18NextController, AuthController]
})
export class ApisModules {}
