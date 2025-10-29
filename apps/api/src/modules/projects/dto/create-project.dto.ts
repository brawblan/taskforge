import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Project Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'This is a project description example.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'adjh38hrjahldkhn0i4' })
  @IsNotEmpty()
  @IsString()
  ownerId: string;
}
