import { UserEntity } from 'src/users/entities/user.entity';
import { MessageEntity } from './message.entitiy';

export class ChatEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: UserEntity[];
}
