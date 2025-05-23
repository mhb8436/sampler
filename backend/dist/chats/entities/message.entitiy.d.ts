import { UserEntity } from 'src/users/entities/user.entity';
export declare class MessageEntity {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    user: UserEntity;
    constructor(partial: Partial<MessageEntity>);
}
