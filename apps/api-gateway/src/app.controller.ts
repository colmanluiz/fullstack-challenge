import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiResponse({ status: 200, description: 'API Gateway health check' })
  getHealth(): { status: string; message: string; timestamp: string } {
    return this.appService.getHealth();
  }
}