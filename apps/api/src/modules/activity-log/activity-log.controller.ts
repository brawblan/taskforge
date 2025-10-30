import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { FilterActivityDto } from './dto/filter-activity.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Activity')
@Controller('activity')
export class ActivityLogController {
  constructor(private readonly activityService: ActivityLogService) {}

  @Get()
  @ApiOperation({
    summary: 'List all activity logs (optionally filtered by taskId)',
  })
  findAll(@Query() query: FilterActivityDto) {
    return this.activityService.findAllByEntity(query);
  }
}
