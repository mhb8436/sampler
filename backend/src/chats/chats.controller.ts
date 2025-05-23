import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from './entities/message.entitiy';

@Controller('chats')
@ApiTags('chats')
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  // 채팅방 생성 (인증 필요)
  @UseGuards(JwtAuthGuard)
  @Post('rooms')
  @ApiOperation({ summary: '채팅방 생성' })
  async createRoom(@Request() req, @Body() dto: CreateRoomDto) {
    return this.chatsService.createRoom(dto.name);
  }

  // 전체 채팅방 목록 조회
  @Get('rooms')
  @ApiOperation({ summary: '전체 채팅방 목록 조회' })
  async getRooms() {
    return this.chatsService.getRooms();
  }

  // 특정 채팅방 메시지 목록 조회
  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: '특정 채팅방 메시지 목록 조회' })
  async getMessagesByRoom(@Param('roomId') roomId: string) {
    const messages = await this.chatsService.getMessagesByRoom(Number(roomId));
    const messageEntities = messages.map(
      (message) => new MessageEntity(message),
    );
    return messageEntities;
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/messages')
  @ApiOperation({ summary: '메시지 전송' })
  async sendMessage(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() dto: SendMessageDto,
  ) {
    console.log(req.user);
    const message = await this.chatsService.createMessage({
      chatRoomId: roomId,
      userId: req.user.id,
      content: dto.content,
    });
    return new MessageEntity(message);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/join')
  @ApiOperation({ summary: '채팅방 입장' })
  async joinRoom(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.chatsService.joinRoom(req.user.id, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rooms/:roomId/leave')
  @ApiOperation({ summary: '채팅방 퇴장' })
  async leaveRoom(
    @Request() req,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.chatsService.leaveRoom(req.user.id, roomId);
  }
}
