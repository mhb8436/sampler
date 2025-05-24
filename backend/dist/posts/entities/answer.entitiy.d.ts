import { UserEntity } from "src/users/entities/user.entity";
export declare class AnswerEntity {
    id: number;
    content: string;
    userId?: number;
    user?: UserEntity;
    constructor(partial: Partial<AnswerEntity>);
}
