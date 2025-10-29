import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        project: { connect: { id: dto.projectId } },
      },
      include: { project: true },
    });
  }

  async findAll(filters: FilterTasksDto) {
    const { status, priority, dueDate, page = 1, limit = 10 } = filters;

    const where: Prisma.TaskWhereInput = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dueDate) where.dueDate = { lte: new Date(dueDate) };

    const tasks = await this.prisma.task.findMany({
      where,
      include: { project: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.task.count({ where });

    return {
      data: tasks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
        include: { project: true },
      });
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
