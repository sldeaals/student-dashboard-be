import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: 'student-dashboard-be',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  /**
   * Used for readiness/liveness probes
   */
  shutdownSignals: ['SIGTERM', 'SIGINT'],
}));
