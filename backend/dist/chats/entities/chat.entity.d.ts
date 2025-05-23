import { UserEntity } from 'src/users/entities/user.entity';
export declare class ChatEntity {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users: UserEntity[];
}
