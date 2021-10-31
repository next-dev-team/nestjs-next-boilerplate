import { Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ExceptionFilter } from '@lib/socket/socket.filter';

@UseFilters(ExceptionFilter)
@WebSocketGateway({ namespace: 'user', cors: { origin: '*' } })
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private logger = new Logger('UserGateway');

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: string): void {
    client.emit('message', payload);
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Socket ID: ${socket.id} connected!`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ID: ${socket.id} disconnected!`);
  }

  @SubscribeMessage('welcome')
  onEvent(): WsResponse<string> {
    throw new WsException('Error Testing');
  }

  emit(eventName: string, body: any) {
    this.server.emit(eventName, body);
  }
}
