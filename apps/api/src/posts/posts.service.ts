import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePostDto } from './dto/create-post.dto.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Пост с id ${id} не найден`);
    }
    return post;
  }

  create(dto: CreatePostDto) {
    return this.prisma.post.create({ data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
  }
}
