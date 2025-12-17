import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Health check for:
   * - Kubernetes liveness/readiness
   * - Load balancers
   * - Monitoring systems
   */
  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
