import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProjectDto) {
    return this.prisma.project.create({ data });
  }

  findAll(ownerId?: string) {
    if (ownerId) {
      return this.prisma.project.findMany({ where: { ownerId } });
    }
    return this.prisma.project.findMany();
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
