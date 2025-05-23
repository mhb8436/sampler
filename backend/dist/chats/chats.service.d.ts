import { PrismaService } from 'src/prisma/prisma.service';
import { ChatsGateway } from './chats.gateway';
export declare class ChatsService {
    private prisma;
    private chatsGateway;
    constructor(prisma: PrismaService, chatsGateway: ChatsGateway);
    createRoom(name: string): Promise<{
        id: number;
        name: string;
    }>;
    getRooms(): Promise<({
        users: {
            id: number;
            email: string;
            password: string;
            nickname: string;
        }[];
    } & {
        id: number;
        name: string;
    })[]>;
    createMessage(data: {
        chatRoomId: number;
        userId: number;
        content: string;
    }): Promise<{
        user: {
            id: number;
            email: string;
            password: string;
            nickname: string;
        };
    } & {
        id: number;
        content: string;
        createdAt: Date;
        chatRoomId: number;
        userId: number;
    }>;
    getMessagesByRoom(chatRoomId: number): Promise<({
        user: {
            id: number;
            email: string;
            password: string;
            nickname: string;
        };
    } & {
        id: number;
        content: string;
        createdAt: Date;
        chatRoomId: number;
        userId: number;
    })[]>;
    joinRoom(userId: number, roomId: number): Promise<{
        id: number;
        name: string;
    }>;
    leaveRoom(userId: number, roomId: number): Promise<{
        id: number;
        name: string;
    }>;
}
