import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Simple health sanity message
   */
  getHello(): string {
    return 'Student Dashboard API is running';
  }
}
