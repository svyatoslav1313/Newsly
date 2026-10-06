import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { PostsModule } from './posts/posts.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Читает apps/api/.env; isGlobal — ConfigService доступен во всех модулях.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    PostsModule,
  ],
})
export class AppModule {}
