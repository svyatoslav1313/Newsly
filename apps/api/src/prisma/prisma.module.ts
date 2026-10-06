import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// @Global — PrismaService можно внедрять в любом модуле без импорта PrismaModule.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
