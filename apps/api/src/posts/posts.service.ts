import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async create(dto: CreatePostDto) {
    // Авторизации пока нет, поэтому автором становится первый пользователь
    // из базы (его создаёт seed). Когда появится вход, сюда нужно передавать
    // id текущего пользователя.
    const author = await this.prisma.user.findFirst({ orderBy: { id: 'asc' } });

    if (!author) {
      throw new BadRequestException(
        'No users in the database: run pnpm db:seed',
      );
    }

    return this.prisma.post.create({
      data: { title: dto.title, content: dto.content, authorId: author.id },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
  }
}
