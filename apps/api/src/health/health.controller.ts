import type { HealthStatus } from '@my-project/shared';
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<HealthStatus> {
    let database: HealthStatus['database'] = 'up';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    return {
      status: database === 'up' ? 'ok' : 'error',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
