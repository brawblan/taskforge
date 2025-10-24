import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const health: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService, PrismaService],
    }).compile();

    healthController = health.get<HealthController>(HealthController);
  });

  describe('root', () => {
    const fixedDate = new Date('2025-10-24T03:08:01.172Z');

    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(fixedDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should return successful check"', () => {
      expect(healthController.getHealth()).toEqual({
        message: 'Health Check OK',
        ok: true,
        timestamp: fixedDate.toISOString(),
      });
    });
  });
});
