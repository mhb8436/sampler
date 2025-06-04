import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatsService } from './chats.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: true })
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server; // socket.io

  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => ChatsService))
    private chatsService: ChatsService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  // 메시지 브로드캐스팅을 위한 메서드
  broadcastMessage(roomId: number, message: any) {
    console.log('boardcastMessage ', message);
    this.server.to(`room_${roomId}`).emit('message', message);
  }

  async handleConnection(client: Socket) {
    // JWT 인증: access_token 쿼리로 전달
    // console.log(client.handshake.headers.authorization);
    const bearerToken = client.handshake.headers.authorization;
    const token = bearerToken?.split(' ')[1]; // Beaerer xxxx
    // console.log(token);
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      (client as any).user = payload; // { sub: userId, nickname , email}

      const rooms = await this.chatsService.getRooms();
      console.log(payload);
      rooms.forEach((room) => {
        if (room.users.some((user) => user.id === payload.sub)) {
          client.join(`room_${room.id}`); // room_1
        }
      });
    } catch (e) {
      console.log(e);
      client.disconnect();
    }

    // 채팅방 목록을 조회해서 join 된 방이 있으면 자동으로 join 시키기
  }

  handleDisconnect(client: Socket) {
    // 연결 해제 시 처리 (필요시)
  }

  // 채팅방 입장
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatRoomId: number },
  ) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const chatRoomId = parsedData.chatRoomId;

    console.log('joinRoom', parsedData, chatRoomId, (client as any).user);

    client.join(`room_${chatRoomId}`);
    await this.chatsService.joinRoom((client as any).user.sub, chatRoomId);
    client
      .to(`room_${chatRoomId}`)
      .emit('notice', `${(client as any).user.nickname}님이 입장했습니다.`);
  }

  // 채팅방 퇴장
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatRoomId: number },
  ) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const chatRoomId = parsedData.chatRoomId;
    client.leave(`room_${chatRoomId}`);
    await this.chatsService.leaveRoom(chatRoomId, (client as any).user.sub);
    client
      .to(`room_${chatRoomId}`)
      .emit('notice', `${(client as any).user.nickname}님이 퇴장했습니다.`);
  }

  // 메시지 전송
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string | SendMessageDto,
  ) {
    // String으로 들어온 경우 JSON으로 파싱
    const dto = typeof data === 'string' ? JSON.parse(data) : data;

    console.log('Received message data:', {
      rawData: data,
      parsedDto: dto,
      user: (client as any).user,
    });

    const user = (client as any).user;
    // 메시지 생성 (서비스에서 자동으로 브로드캐스팅)
    const message = await this.chatsService.createMessage({
      chatRoomId: dto.chatRoomId,
      userId: user.sub,
      content: dto.content,
    });

    return message;
  }
}
