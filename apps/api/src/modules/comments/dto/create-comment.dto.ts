import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The user ID who created the comment' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Project ID (optional)', required: false })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({ description: 'Task ID (optional)', required: false })
  @IsString()
  @IsOptional()
  taskId?: string;
}
