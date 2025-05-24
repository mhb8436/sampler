import { UserEntity } from "src/users/entities/user.entity";
import { AnswerEntity } from "./answer.entitiy";
export declare class PostEntity {
    id: number;
    title: string;
    content: string;
    userId?: number;
    user: UserEntity;
    answers?: AnswerEntity[];
    constructor(partial: Partial<PostEntity>);
}
