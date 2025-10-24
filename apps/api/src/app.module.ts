import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), HealthModule],
})
export class AppModule {}
