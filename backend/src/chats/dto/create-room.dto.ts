import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @ApiProperty({ description: '채팅방 이름', example: '채팅방 이름' })
  name: string;
}
