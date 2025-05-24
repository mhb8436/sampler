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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chats_gateway_1 = require("./chats.gateway");
let ChatsService = class ChatsService {
    prisma;
    chatsGateway;
    constructor(prisma, chatsGateway) {
        this.prisma = prisma;
        this.chatsGateway = chatsGateway;
    }
    async createRoom(name) {
        return this.prisma.chatRoom.create({
            data: { name },
        });
    }
    async getRooms() {
        return this.prisma.chatRoom.findMany({
            include: { users: true },
            orderBy: { id: 'desc' },
        });
    }
    async createMessage(data) {
        console.log(`createMessage: ${JSON.stringify(data)}`);
        const message = await this.prisma.message.create({
            data: {
                chatRoomId: data.chatRoomId,
                userId: data.userId,
                content: data.content,
            },
            include: {
                user: true,
            },
        });
        this.chatsGateway.broadcastMessage(data.chatRoomId, {
            id: message.id,
            chatRoomId: message.chatRoomId,
            user: {
                id: message.user.id,
                nickname: message.user.nickname,
            },
            content: message.content,
            createdAt: message.createdAt,
        });
        return message;
    }
    async getMessagesByRoom(chatRoomId) {
        return this.prisma.message.findMany({
            where: { chatRoomId },
            include: { user: true },
            orderBy: { id: 'asc' },
        });
    }
    async joinRoom(userId, roomId) {
        console.log("joinRoom ", userId, roomId);
        return this.prisma.chatRoom.update({
            where: { id: roomId },
            data: { users: { connect: [{ id: userId }] } },
        });
    }
    async leaveRoom(userId, roomId) {
        const room = await this.prisma.chatRoom.findUnique({
            where: { id: roomId },
            include: { users: true },
        });
        if (!room)
            throw new Error('채팅방이 존재하지 않습니다.');
        const isJoined = room.users.some(user => user.id === userId);
        if (!isJoined)
            throw new Error('이미 퇴장한 사용자입니다.');
        return this.prisma.chatRoom.update({
            where: { id: roomId },
            data: { users: { disconnect: [{ id: userId }] } },
        });
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => chats_gateway_1.ChatsGateway))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chats_gateway_1.ChatsGateway])
], ChatsService);
//# sourceMappingURL=chats.service.js.map