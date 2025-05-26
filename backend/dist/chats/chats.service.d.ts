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
            email: string;
            nickname: string;
            password: string;
            id: number;
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
            email: string;
            nickname: string;
            password: string;
            id: number;
        };
    } & {
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        chatRoomId: number;
    }>;
    getMessagesByRoom(chatRoomId: number): Promise<({
        user: {
            email: string;
            nickname: string;
            password: string;
            id: number;
        };
    } & {
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        chatRoomId: number;
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
