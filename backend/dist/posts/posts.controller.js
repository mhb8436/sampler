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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_answer_dto_1 = require("./dto/update-answer.dto");
const create_answer_dto_1 = require("./dto/create-answer.dto");
const swagger_1 = require("@nestjs/swagger");
const post_entity_1 = require("./entities/post.entity");
const azure_storage_interceptor_1 = require("../azure-storage/azure-storage.interceptor");
const platform_express_1 = require("@nestjs/platform-express");
let PostsController = class PostsController {
    postsService;
    constructor(postsService) {
        this.postsService = postsService;
    }
    async createPost(req, dto) {
        const post = await this.postsService.createPost(req.user.id, dto, req.files);
        return new post_entity_1.PostEntity(post || {});
    }
    async getPosts() {
        const posts = await this.postsService.getPosts();
        return posts.map((post) => new post_entity_1.PostEntity(post));
    }
    async getPostById(id) {
        const post = await this.postsService.getPostById(Number(id));
        return new post_entity_1.PostEntity(post || {});
    }
    async updatePost(req, id, dto) {
        const post = await this.postsService.updatePost(Number(id), req.user.id, dto);
        return new post_entity_1.PostEntity(post || {});
    }
    async deletePost(req, id) {
        return this.postsService.deletePost(Number(id), req.user.id);
    }
    async createAnswer(req, postId, dto) {
        return this.postsService.createAnswer(req.user.id, Number(postId), dto);
    }
    async getAnswersByPost(postId) {
        return this.postsService.getAnswersByPost(Number(postId));
    }
    async updateAnswer(req, id, dto) {
        return this.postsService.updateAnswer(Number(id), req.user.id, dto);
    }
    async deleteAnswer(req, id) {
        return this.postsService.deleteAnswer(Number(id), req.user.id);
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('posts'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        limits: {
            fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (req, file, cb) => {
            const allowedType = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/pdf',
            ];
            if (allowedType.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Invalid file type'), false);
            }
        },
    }), azure_storage_interceptor_1.AzureStorageInterceptor),
    (0, swagger_1.ApiOperation)({ summary: '게시글 생성' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts'),
    (0, swagger_1.ApiOperation)({ summary: '전체 게시글 조회' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: '단일 게시글 조회' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPostById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 수정' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('posts/:id'),
    (0, swagger_1.ApiOperation)({ summary: '게시글 삭제' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('posts/:postId/answers'),
    (0, swagger_1.ApiOperation)({ summary: '답변 작성' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_answer_dto_1.CreateAnswerDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createAnswer", null);
__decorate([
    (0, common_1.Get)('posts/:postId/answers'),
    (0, swagger_1.ApiOperation)({ summary: '게시글별 답변 조회' }),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getAnswersByPost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('answers/:id'),
    (0, swagger_1.ApiOperation)({ summary: '답변 수정' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_answer_dto_1.UpdateAnswerDto]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updateAnswer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('answers/:id'),
    (0, swagger_1.ApiOperation)({ summary: '답변 삭제' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deleteAnswer", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    (0, swagger_1.ApiTags)('posts'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
//# sourceMappingURL=posts.controller.js.map