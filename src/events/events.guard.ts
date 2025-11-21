import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class EventGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient<Socket>();
    const accessToken = socket.handshake.query.accessToken;

    if (!accessToken) throw new WsException('Missing token.');
    // TODO: validate accessToken logic here
    return true;
  }
}
