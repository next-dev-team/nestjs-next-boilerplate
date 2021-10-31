import { Module } from '@nestjs/common';

import { UserGateway } from './user/user.gateway';

@Module({
  providers: [UserGateway],
  exports: [UserGateway]
})
export class SocketProvidersModule {}
