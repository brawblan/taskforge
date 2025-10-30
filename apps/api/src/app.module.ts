import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { ActivityLogModule } from '@/modules/activity-log/activity-log.module';
import { HealthModule } from '@/modules/health/health.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ProjectsModule } from '@/modules/projects/projects.module';
import { TasksModule } from '@/modules/tasks/tasks.module';
import { UsersModule } from '@/modules/users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ActivityLogModule,
    HealthModule,
    PrismaModule,
    ProjectsModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
