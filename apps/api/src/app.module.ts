import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, HealthModule],
})
export class AppModule {}
