import { Module } from '@nestjs/common';

import { PwdService } from './pwd.service';

@Module({
  providers: [PwdService]
})
export class PwdModule {}
