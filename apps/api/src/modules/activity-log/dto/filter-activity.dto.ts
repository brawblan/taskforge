import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterActivityDto {
  @ApiPropertyOptional({ example: 'taskId_123' })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiPropertyOptional({ example: 'projectId_123' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ example: 'userId_123' })
  @IsOptional()
  @IsString()
  userId?: string;
}
