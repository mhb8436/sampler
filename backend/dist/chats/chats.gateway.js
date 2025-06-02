"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const chats_service_1 = require("./chats.service");
const socket_io_1 = require("socket.io");
let ChatsGateway = class ChatsGateway {
    jwtService;
    chatsService;
    server;
    constructor(jwtService, chatsService) {
        this.jwtService = jwtService;
        this.chatsService = chatsService;
    }
    afterInit(server) {
        console.log('WebSocket Gateway initialized');
    }
    broadcastMessage(roomId, message) {
        console.log('boardcastMessage ', message);
        this.server.to(`room_${roomId}`).emit('message', message);
    }
    async handleConnection(client) {
        const bearerToken = client.handshake.headers.authorization;
        const token = bearerToken?.split(' ')[1];
        if (!token) {
            client.disconnect();
            return;
        }
        try {
            const payload = this.jwtService.verify(token);
            client.user = payload;
            const rooms = await this.chatsService.getRooms();
            console.log(payload);
            rooms.forEach((room) => {
                if (room.users.some((user) => user.id === payload.sub)) {
                    client.join(`room_${room.id}`);
                }
            });
        }
        catch (e) {
            console.log(e);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
    }
    async handleJoinRoom(client, data) {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const chatRoomId = parsedData.chatRoomId;
        console.log('joinRoom', parsedData, chatRoomId, client.user);
        client.join(`room_${chatRoomId}`);
        await this.chatsService.joinRoom(client.user.sub, chatRoomId);
        client
            .to(`room_${chatRoomId}`)
            .emit('notice', `${client.user.nickname}님이 입장했습니다.`);
    }
    async handleLeaveRoom(client, data) {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        const chatRoomId = parsedData.chatRoomId;
        client.leave(`room_${chatRoomId}`);
        await this.chatsService.leaveRoom(chatRoomId, client.user.sub);
        client
            .to(`room_${chatRoomId}`)
            .emit('notice', `${client.user.nickname}님이 퇴장했습니다.`);
    }
    async handleSendMessage(client, data) {
        const dto = typeof data === 'string' ? JSON.parse(data) : data;
        console.log('Received message data:', {
            rawData: data,
            parsedDto: dto,
            user: client.user,
        });
        const user = client.user;
        const message = await this.chatsService.createMessage({
            chatRoomId: dto.chatRoomId,
            userId: user.sub,
            content: dto.content,
        });
        return message;
    }
};
exports.ChatsGateway = ChatsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatsGateway.prototype, "handleSendMessage", null);
exports.ChatsGateway = ChatsGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chats_service_1.ChatsService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        chats_service_1.ChatsService])
], ChatsGateway);
//# sourceMappingURL=chats.gateway.js.map