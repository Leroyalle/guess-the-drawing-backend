import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

type PaintCoords = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

@WebSocketGateway({ cors: true })
export class AppGateway {
  @SubscribeMessage('paint')
  painting(
    @MessageBody() data: PaintCoords,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.broadcast.emit('paint', data);
  }
  handleConnection(socket: Socket) {
    console.log('conn', socket);
  }
}
