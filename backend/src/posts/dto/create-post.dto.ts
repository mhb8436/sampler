import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @ApiProperty({ description: '게시글 제목', example: '게시글 제목' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: '게시글 내용', example: '게시글 내용' })
  content: string;
}
