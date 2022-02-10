import { Logger } from '@nestjs/common';

/**
 * @see https://docs.nestjs.com/techniques/task-scheduling
 */
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  // @Interval(2000000)
  handleInterval() {
    this.logger.debug('Scheduling is running on every 20 mins');
  }
}
