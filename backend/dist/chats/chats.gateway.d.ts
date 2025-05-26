import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ChatsService } from './chats.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Server, Socket } from 'socket.io';
export declare class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private jwtService;
    private chatsService;
    server: Server;
    constructor(jwtService: JwtService, chatsService: ChatsService);
    afterInit(server: Server): void;
    broadcastMessage(roomId: number, message: any): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        chatRoomId: number;
    }): Promise<void>;
    handleLeaveRoom(client: Socket, data: {
        chatRoomId: number;
    }): Promise<void>;
    handleSendMessage(client: Socket, data: string | SendMessageDto): Promise<{
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
}
