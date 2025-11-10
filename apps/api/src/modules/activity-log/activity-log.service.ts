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
    const { taskId, projectId, userId, days, page = 1, limit = 10 } = filters;

    const where: Prisma.ActivityLogWhereInput = {};

    if (taskId) where.taskId = taskId;
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;
    if (days) {
      const timePeriodAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      where.createdAt = { gt: timePeriodAgo };
    }

    const activities = await this.prisma.activityLog.findMany({
      where,
      include: {
        user: true,
        task: true,
        project: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.activityLog.count({ where });

    return {
      data: activities,
      meta: {
        page: page,
        limit: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
