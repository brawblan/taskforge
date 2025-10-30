import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { FilterActivityDto } from './dto/filter-activity.dto';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async record(data: CreateActivityLogDto) {
    return this.prisma.activityLog.create({ data });
  }

  async findAllByEntity(filters: FilterActivityDto) {
    const where: Prisma.ActivityLogWhereInput = {};

    if (filters.taskId) where.taskId = filters.taskId;
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.userId) where.userId = filters.userId;

    return this.prisma.activityLog.findMany({
      where,
      include: {
        user: true,
        task: true,
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
