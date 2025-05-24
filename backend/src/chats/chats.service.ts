import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatsGateway } from './chats.gateway';

@Injectable()
export class ChatsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ChatsGateway))
    private chatsGateway: ChatsGateway,
  ) {}

  // 채팅방 생성
  async createRoom(name: string) {
    return this.prisma.chatRoom.create({
      data: { name },
    });
  }

  // 전체 채팅방 조회
  async getRooms() {
    return this.prisma.chatRoom.findMany({
      include: { users: true },
      orderBy: { id: 'desc' },
    });
  }

  // 메시지 생성
  async createMessage(data: {
    chatRoomId: number;
    userId: number;
    content: string;
  }) {
    console.log(`createMessage: ${JSON.stringify(data)}`);

    // 메시지 생성
    const message = await this.prisma.message.create({
      data: {
        chatRoomId: data.chatRoomId,
        userId: data.userId,
        content: data.content,
      },
      include: {
        user: true,
      },
    });

    // 메시지 브로드캐스팅
    this.chatsGateway.broadcastMessage(data.chatRoomId, {
      id: message.id,
      chatRoomId: message.chatRoomId,
      user: {
        id: message.user.id,
        nickname: message.user.nickname,
      },
      content: message.content,
      createdAt: message.createdAt,
    });

    return message;
  }

  // 채팅방별 메시지 조회
  async getMessagesByRoom(chatRoomId: number) {
    return this.prisma.message.findMany({
      where: { chatRoomId },
      include: { user: true },
      orderBy: { id: 'asc' },
    });
  }

  // 채팅방 입장
  async joinRoom(userId: number, roomId: number) {
    console.log("joinRoom ", userId, roomId);
    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { users: { connect: [{ id: userId }] } },
    });
  }

  // 채팅방 퇴장
  async leaveRoom(userId: number, roomId: number) {
    const room = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: { users: true },
    });
    if (!room) throw new Error('채팅방이 존재하지 않습니다.');
    const isJoined = room.users.some(user => user.id === userId);
    if (!isJoined) throw new Error('이미 퇴장한 사용자입니다.');
    return this.prisma.chatRoom.update({
      where: { id: roomId },
      data: { users: { disconnect: [{ id: userId }] } },
    });
  }
}
