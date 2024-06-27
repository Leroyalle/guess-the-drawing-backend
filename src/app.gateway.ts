import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type PaintCoords = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('paint')
  async painting(
    @MessageBody() data: PaintCoords,
    @ConnectedSocket() socket: Socket,
  ) {
    const sockets = await this.server.fetchSockets();
    sockets.forEach((s) => {
      if (s.id !== socket.id) {
        socket.broadcast.to('test').emit('repaint', data);
      }
    });
  }

  @SubscribeMessage('clear')
  async clear(@ConnectedSocket() socket: Socket) {
    const sockets = await this.server.fetchSockets();
    sockets.forEach((s) => {
      if (s.id !== socket.id) {
        socket.broadcast.to('test').emit('clear_canvas');
      }
    });
  }

  @SubscribeMessage('send_message')
  async onSendMessage(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const sockets = await this.server.fetchSockets();
    console.log('ДО ФОРИЧА', data);
    // sockets.forEach((s) => {
    //   if (s.id !== socket.id) {
    console.log('ПОСЛЕ', data);
    socket.broadcast.to('test').emit('get_message', data);
    // }
  }
  // );
  // }

  handleConnection(socket: Socket) {
    socket.join('test');
  }
}
