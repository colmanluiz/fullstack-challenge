import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; message: string; timestamp: string } {
    return {
      status: 'healthy',
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
    };
  }
}