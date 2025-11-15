import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FilterCommentsDto } from './dto/filter-comments.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateCommentDto) {
    return this.commentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all comments (with filters)' })
  findAll(@Query() filters: FilterCommentsDto) {
    return this.commentsService.findAll(filters);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}

