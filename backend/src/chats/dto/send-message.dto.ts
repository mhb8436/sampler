import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @ApiProperty({ description: '채팅방 ID', example: 1 })
  chatRoomId: number;

  @IsNotEmpty()
  @ApiProperty({ description: '메시지 내용', example: '메시지 내용' })
  content: string;
}
