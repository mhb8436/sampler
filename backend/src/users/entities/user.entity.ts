import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  email: string;
  nickname: string;
  @Exclude()
  password: string;
  @Exclude()
  createdAt?: Date;
  @Exclude()
  updatedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
