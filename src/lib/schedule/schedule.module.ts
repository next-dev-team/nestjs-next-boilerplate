import { Global, Module } from '@nestjs/common';
import { ScheduleModule as _ScheduleModule } from '@nestjs/schedule';

import { ScheduleService } from './schedule.service';

@Global()
@Module({
  imports: [_ScheduleModule.forRoot()],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
