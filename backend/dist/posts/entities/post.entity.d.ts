import { UserEntity } from 'src/users/entities/user.entity';
import { AnswerEntity } from './answer.entitiy';
import { AttachmentEntity } from './attachment.entitiy';
export declare class PostEntity {
    id: number;
    title: string;
    content: string;
    userId?: number;
    user: UserEntity;
    answers?: AnswerEntity[];
    attachments?: AttachmentEntity[];
    constructor(partial: Partial<PostEntity>);
}
