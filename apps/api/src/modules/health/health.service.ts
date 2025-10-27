import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  getHealth(): { ok: boolean; timestamp: string; message: string } {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      message: 'Health Check OK',
    };
  }
}
