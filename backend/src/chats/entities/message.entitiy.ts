import { UserEntity } from 'src/users/entities/user.entity';

export class MessageEntity {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  user: UserEntity;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
  }
}
