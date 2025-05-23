export declare class UserEntity {
    id: number;
    email: string;
    nickname: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(partial: Partial<UserEntity>);
}
