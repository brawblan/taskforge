import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterProjectsDto } from './dto/filter-projects.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }

  async findAll(filters: FilterProjectsDto) {
    const { ownerId, days, page = 1, limit = 10 } = filters;

    const where: Prisma.ProjectWhereInput = {};

    if (ownerId) where.ownerId = ownerId;
    if (days) {
      const timePeriodAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      where.updatedAt = { gt: timePeriodAgo };
    }

    const projects = await this.prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        tasks: true,
        activity: true,
      },
    });

    const total = await this.prisma.project.count({ where });

    return {
      data: projects,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    try {
      return this.prisma.project.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
