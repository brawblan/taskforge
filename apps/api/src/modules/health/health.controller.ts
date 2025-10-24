import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { Todo as TodoModel } from 'generated/prisma';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(): { ok: boolean; timestamp: string; message: string } {
    return this.healthService.getHealth();
  }

  @Get('todos/:id')
  async getTodo(@Param('id') id: string) {
    return this.healthService.todo({ id: Number(id) });
  }

  @Get('todos')
  async getTodos() {
    return this.healthService.todos({});
  }

  @Post('todo')
  async createTodo(@Body() todoData: { title: string }): Promise<TodoModel> {
    return this.healthService.createTodo(todoData);
  }

  @Put('todo/:id')
  async updateTodo(
    @Param('id') id: string,
    @Body() todoData: { title: string },
  ): Promise<TodoModel> {
    return this.healthService.updateTodo({
      where: { id: Number(id) },
      data: todoData,
    });
  }

  @Delete('todo/:id')
  async deleteTodo(@Param('id') id: string): Promise<TodoModel> {
    return this.healthService.deleteTodo({ id: Number(id) });
  }
}
