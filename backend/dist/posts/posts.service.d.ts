import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(userId: number, createPostDto: CreatePostDto, files: Express.Multer.File[]): Promise<({
        user: {
            email: string;
            nickname: string;
            password: string;
            id: number;
        };
        attachments: {
            id: number;
            createdAt: Date;
            fileName: string;
            fileUrl: string;
            fileSize: number;
            fileType: string;
            postId: number;
        }[];
    } & {
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }) | null>;
    getPosts(): Promise<({
        user: {
            email: string;
            nickname: string;
            password: string;
            id: number;
        };
        answers: {
            id: number;
            content: string;
            createdAt: Date;
            userId: number;
            postId: number;
        }[];
    } & {
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    })[]>;
    getPostById(id: number): Promise<({
        user: {
            email: string;
            nickname: string;
            password: string;
            id: number;
        };
        answers: {
            id: number;
            content: string;
            createdAt: Date;
            userId: number;
            postId: number;
        }[];
    } & {
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }) | null>;
    updatePost(id: number, userId: number, dto: UpdatePostDto): Promise<{
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }>;
    deletePost(id: number, userId: number): Promise<{
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }>;
    createAnswer(userId: number, postId: number, dto: CreateAnswerDto): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
    getAnswersByPost(postId: number): Promise<({
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
        postId: number;
    })[]>;
    updateAnswer(id: number, userId: number, dto: UpdateAnswerDto): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
    deleteAnswer(id: number, userId: number): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
}
