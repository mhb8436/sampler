import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  createPost(userId: number, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId,
      },
    });
  }

  // 전체 게시글 조회
  async getPosts() {
    return this.prisma.post.findMany({
      include: { user: true, answers: true },
      orderBy: { id: 'desc' },
    });
  }

  // 단일 게시글 조회
  async getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { user: true, answers: true },
    });
  }

  // 게시글 수정
  async updatePost(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId)
      throw new Error('권한 없음 또는 게시글 없음');
    return this.prisma.post.update({ where: { id }, data: dto });
  }

  // 게시글 삭제
  async deletePost(id: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post || post.userId !== userId)
      throw new Error('권한 없음 또는 게시글 없음');
    return this.prisma.post.delete({ where: { id } });
  }

  // 답변 생성
  async createAnswer(userId: number, postId: number, dto: CreateAnswerDto) {
    return this.prisma.answer.create({
      data: {
        ...dto,
        userId,
        postId,
      },
    });
  }

  // 게시글별 답변 조회
  async getAnswersByPost(postId: number) {
    return this.prisma.answer.findMany({
      where: { postId },
      include: { user: true },
      orderBy: { id: 'asc' },
    });
  }

  // 답변 수정
  async updateAnswer(id: number, userId: number, dto: UpdateAnswerDto) {
    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer || answer.userId !== userId)
      throw new Error('권한 없음 또는 답변 없음');
    return this.prisma.answer.update({ where: { id }, data: dto });
  }

  // 답변 삭제
  async deleteAnswer(id: number, userId: number) {
    const answer = await this.prisma.answer.findUnique({ where: { id } });
    if (!answer || answer.userId !== userId)
      throw new Error('권한 없음 또는 답변 없음');
    return this.prisma.answer.delete({ where: { id } });
  }
}
