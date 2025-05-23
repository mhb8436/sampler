import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(req: any, dto: CreatePostDto): Promise<{
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }>;
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
    getPostById(id: string): Promise<({
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
    updatePost(req: any, id: string, dto: UpdatePostDto): Promise<{
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }>;
    deletePost(req: any, id: string): Promise<{
        title: string;
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
    }>;
    createAnswer(req: any, postId: string, dto: CreateAnswerDto): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
    getAnswersByPost(postId: string): Promise<({
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
    updateAnswer(req: any, id: string, dto: UpdateAnswerDto): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
    deleteAnswer(req: any, id: string): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        userId: number;
        postId: number;
    }>;
}
