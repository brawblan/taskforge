import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { ActivityLogService } from '../activity-log/activity-log.service';

enum TaskOperator {
  CREATE = 'CREATE_TASK',
  UPDATE = 'UPDATE_TASK',
  DELETE = 'DELETE_TASK',
}

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activity: ActivityLogService,
  ) {}

  async create(dto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.TODO,
        priority: dto.priority ?? TaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        project: { connect: { id: dto.projectId } },
      },
      include: { project: true },
    });

    await this.activity.record({
      action: TaskOperator.CREATE,
      taskId: task.id,
      projectId: dto.projectId,
      message: `Task "${task.title}" created.`,
    });

    return task;
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
    const old = await this.prisma.task.findUnique({ where: { id } });
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { project: true },
    });

    let message = 'Task updated.';
    if (dto.status && dto.status !== old?.status) {
      message = `Status changed from ${old?.status} → ${dto.status}.`;
    }

    await this.activity.record({
      action: TaskOperator.UPDATE,
      taskId: id,
      projectId: updated.projectId,
      message,
    });

    return updated;
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.task.delete({ where: { id } });
      await this.activity.record({
        action: TaskOperator.DELETE,
        taskId: id,
        projectId: deleted.projectId,
        message: `Task "${deleted.title}" deleted.`,
      });
      return deleted;
    } catch {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
