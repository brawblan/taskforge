import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { HealthModule } from '@/modules/health/health.module';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { UsersModule } from '@/modules/users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    HealthModule,
    PrismaModule,
    ProjectsModule,
  ],
})
export class AppModule {}
