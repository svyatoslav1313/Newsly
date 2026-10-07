import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        passwordHash,
      },
      omit: { passwordHash: true },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      omit: { passwordHash: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  getCountOfUsers() {
    return this.prisma.user.count();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const name = updateUserDto.name ?? user.name;
    const email = updateUserDto.email ?? user.email;

    if (name === user.name && email === user.email) {
      return user;
    }

    if (email !== user.email) {
      const owner = await this.prisma.user.findUnique({
        where: { email },
      });

      if (owner) {
        throw new ConflictException(`User with email ${email} already exists`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { name, email },
      omit: { passwordHash: true },
    });
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const matches = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!matches) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Посты пользователя не удаляются: база сама обнуляет у них authorId
    // (onDelete: SetNull в schema.prisma).
    return this.prisma.user.delete({
      where: { id },
      omit: { passwordHash: true },
    });
  }
}
