import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PostEntity } from './entities/post.entity';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    createPost(req: any, dto: CreatePostDto): Promise<PostEntity>;
    getPosts(): Promise<PostEntity[]>;
    getPostById(id: string): Promise<PostEntity>;
    updatePost(req: any, id: string, dto: UpdatePostDto): Promise<PostEntity>;
    deletePost(req: any, id: string): Promise<{
        id: number;
        title: string;
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
            id: number;
            email: string;
            password: string;
            nickname: string;
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
