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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const chats_service_1 = require("./chats.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_room_dto_1 = require("./dto/create-room.dto");
const swagger_1 = require("@nestjs/swagger");
const send_message_dto_1 = require("./dto/send-message.dto");
const message_entitiy_1 = require("./entities/message.entitiy");
let ChatsController = class ChatsController {
    chatsService;
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async createRoom(req, dto) {
        return this.chatsService.createRoom(dto.name);
    }
    async getRooms() {
        return this.chatsService.getRooms();
    }
    async getMessagesByRoom(roomId) {
        const messages = await this.chatsService.getMessagesByRoom(Number(roomId));
        const messageEntities = messages.map((message) => new message_entitiy_1.MessageEntity(message));
        return messageEntities;
    }
    async sendMessage(req, roomId, dto) {
        console.log(req.user);
        const message = await this.chatsService.createMessage({
            chatRoomId: roomId,
            userId: req.user.id,
            content: dto.content,
        });
        return new message_entitiy_1.MessageEntity(message);
    }
    async joinRoom(req, roomId) {
        return this.chatsService.joinRoom(req.user.id, roomId);
    }
    async leaveRoom(req, roomId) {
        return this.chatsService.leaveRoom(req.user.id, roomId);
    }
};
exports.ChatsController = ChatsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('rooms'),
    (0, swagger_1.ApiOperation)({ summary: '채팅방 생성' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Get)('rooms'),
    (0, swagger_1.ApiOperation)({ summary: '전체 채팅방 목록 조회' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: '특정 채팅방 메시지 목록 조회' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getMessagesByRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('rooms/:roomId/messages'),
    (0, swagger_1.ApiOperation)({ summary: '메시지 전송' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('rooms/:roomId/join'),
    (0, swagger_1.ApiOperation)({ summary: '채팅방 입장' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('rooms/:roomId/leave'),
    (0, swagger_1.ApiOperation)({ summary: '채팅방 퇴장' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('roomId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "leaveRoom", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    (0, swagger_1.ApiTags)('chats'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map