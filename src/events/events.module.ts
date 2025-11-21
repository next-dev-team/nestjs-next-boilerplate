import { Module } from '@nestjs/common';
import { EventGateway } from './events.gateway';

@Module({
  providers: [EventGateway]
})
export class EventsModule {}
