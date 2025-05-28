import { UserEntity } from 'src/users/entities/user.entity';
import { AnswerEntity } from './answer.entitiy';
import { AttachmentEntity } from './attachment.entitiy';

export class PostEntity {
  id: number;
  title: string;
  content: string;
  userId?: number;
  user: UserEntity;
  answers?: AnswerEntity[];
  attachments?: AttachmentEntity[];

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
    if (partial.user) {
      this.user = new UserEntity(partial.user);
    }
    if (partial.answers) {
      this.answers = partial.answers.map((answer) => new AnswerEntity(answer));
    }
    if (partial.attachments) {
      this.attachments = partial.attachments.map(
        (attachment) => new AttachmentEntity(attachment),
      );
    }
  }
}
