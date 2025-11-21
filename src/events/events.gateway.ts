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

import { Response } from '@common';

import { ExceptionFilter } from './events.filter';

// uncomment code below to enable guard web socket
// @UseGuards(EventGuard)
@UseFilters(ExceptionFilter)
@WebSocketGateway({ namespace: '/core', cors: { origin: '*' } })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @WebSocketServer()
  server!: Server;
  private logger = new Logger(EventGateway.name);

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
    this.broadcast('123456', 'liveEnd', 'live ended');
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Socket ID: ${socket.id} connected!`);
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log('Disconnect socket', socket.id);
    this.logger.log(`Socket ID: ${socket.id} disconnected!`);
  }

  @SubscribeMessage('welcome')
  onEvent(): WsResponse<string> {
    throw new WsException('Error Testing');
  }

  @SubscribeMessage('joinPersonalRoom')
  onJoinPersonalRoom(client: Socket, roomId: string): void {
    this.logger.log('join personal room:', roomId);
    client.join(roomId);
    client.emit('joinPersonalRoomResult', 'join room successfully');
  }

  emit(eventName: string, body: any) {
    this.server.emit(eventName, this.socketResponse(body));
  }

  /**
   * handle broadcast data any room
   * this function handle broadcast to all users in the room,
   * not except sender
   * @param roomId
   * @param eventName
   * @param body
   */
  broadcast(roomId: string, eventName: string, body: any) {
    this.server.to(roomId).emit(eventName, body);
  }

  socketResponse(data: Record<any, any>, message = 'success') {
    return new Response(message, data, {});
  }
}
