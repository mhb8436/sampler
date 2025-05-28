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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostsService = class PostsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(userId, createPostDto, files) {
        const post = await this.prisma.post.create({
            data: {
                ...createPostDto,
                userId,
            },
        });
        if (files && files.length > 0) {
            const attachmentPromise = files.map(async (file) => {
                return this.prisma.attachment.create({
                    data: {
                        postId: post.id,
                        fileName: file.originalname,
                        fileUrl: file['url'],
                        fileSize: file.size,
                        fileType: file.mimetype,
                    },
                });
            });
            await Promise.all(attachmentPromise);
        }
        return this.prisma.post.findUnique({
            where: { id: post.id },
            include: {
                user: true,
                attachments: true,
            },
        });
    }
    async getPosts() {
        return this.prisma.post.findMany({
            include: { user: true, answers: true },
            orderBy: { id: 'desc' },
        });
    }
    async getPostById(id) {
        return this.prisma.post.findUnique({
            where: { id },
            include: { user: true, answers: true },
        });
    }
    async updatePost(id, userId, dto) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post || post.userId !== userId)
            throw new Error('권한 없음 또는 게시글 없음');
        return this.prisma.post.update({ where: { id }, data: dto });
    }
    async deletePost(id, userId) {
        const post = await this.prisma.post.findUnique({ where: { id } });
        if (!post || post.userId !== userId)
            throw new Error('권한 없음 또는 게시글 없음');
        return this.prisma.post.delete({ where: { id } });
    }
    async createAnswer(userId, postId, dto) {
        return this.prisma.answer.create({
            data: {
                ...dto,
                userId,
                postId,
            },
        });
    }
    async getAnswersByPost(postId) {
        return this.prisma.answer.findMany({
            where: { postId },
            include: { user: true },
            orderBy: { id: 'asc' },
        });
    }
    async updateAnswer(id, userId, dto) {
        const answer = await this.prisma.answer.findUnique({ where: { id } });
        if (!answer || answer.userId !== userId)
            throw new Error('권한 없음 또는 답변 없음');
        return this.prisma.answer.update({ where: { id }, data: dto });
    }
    async deleteAnswer(id, userId) {
        const answer = await this.prisma.answer.findUnique({ where: { id } });
        if (!answer || answer.userId !== userId)
            throw new Error('권한 없음 또는 답변 없음');
        return this.prisma.answer.delete({ where: { id } });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map