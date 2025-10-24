import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth(): { ok: boolean; timestamp: string; message: string } {
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      message: 'Health Check OK',
    };
  }
}
