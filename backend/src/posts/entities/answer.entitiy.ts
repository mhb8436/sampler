import { UserEntity } from "src/users/entities/user.entity";
import { PostEntity } from "./post.entity";

export class AnswerEntity {
    id: number;
    content: string;
    userId?: number;
    user?: UserEntity;

    constructor(partial: Partial<AnswerEntity>) {
      Object.assign(this, partial);
      if (partial.user) {
        this.user = new UserEntity(partial.user);
      }
    }
}