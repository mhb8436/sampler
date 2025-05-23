import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty({ description: '이메일', example: 'test@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: '닉네임', example: 'test' })
  nickname: string;

  @MinLength(6)
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;
}
