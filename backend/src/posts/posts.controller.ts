import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostEntity } from './entities/post.entity';

@Controller('posts')
@ApiTags('posts')
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  @ApiOperation({ summary: '게시글 생성' })
  async createPost(@Request() req, @Body() dto: CreatePostDto) {
    const post = await this.postsService.createPost(req.user.id, dto);
    return new PostEntity(post)
  }

  // 전체 게시글 조회
  @Get('posts')
  @ApiOperation({ summary: '전체 게시글 조회' })
  async getPosts() {
    const posts = await  this.postsService.getPosts();
    return posts.map(post => new PostEntity(post));
  }

  // 단일 게시글 조회
  @Get('posts/:id')
  @ApiOperation({ summary: '단일 게시글 조회' })
  async getPostById(@Param('id') id: string) {
    const post = await this.postsService.getPostById(Number(id));
    return new PostEntity(post || {});
  }

  // 게시글 수정
  @UseGuards(JwtAuthGuard)
  @Patch('posts/:id')
  @ApiOperation({ summary: '게시글 수정' })
  async updatePost(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postsService.updatePost(Number(id), req.user.id, dto);
    return new PostEntity(post || {});
  }

  // 게시글 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  @ApiOperation({ summary: '게시글 삭제' })
  async deletePost(@Request() req, @Param('id') id: string) {
    return this.postsService.deletePost(Number(id), req.user.id);
  }

  // 답변 작성
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/answers')
  @ApiOperation({ summary: '답변 작성' })
  async createAnswer(
    @Request() req,
    @Param('postId') postId: string,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.postsService.createAnswer(req.user.id, Number(postId), dto);
  }

  // 게시글별 답변 조회
  @Get('posts/:postId/answers')
  @ApiOperation({ summary: '게시글별 답변 조회' })
  async getAnswersByPost(@Param('postId') postId: string) {
    return this.postsService.getAnswersByPost(Number(postId));
  }

  // 답변 수정
  @UseGuards(JwtAuthGuard)
  @Patch('answers/:id')
  @ApiOperation({ summary: '답변 수정' })
  async updateAnswer(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateAnswerDto,
  ) {
    return this.postsService.updateAnswer(Number(id), req.user.id, dto);
  }

  // 답변 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('answers/:id')
  @ApiOperation({ summary: '답변 삭제' })
  async deleteAnswer(@Request() req, @Param('id') id: string) {
    return this.postsService.deleteAnswer(Number(id), req.user.id);
  }
}
