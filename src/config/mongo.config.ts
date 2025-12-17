import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri: process.env.MONGODB_URI as string,

  options: {
    dbName: process.env.MONGODB_NAME || 'student-dashboard',
    maxPoolSize: process.env.MONGODB_MAX_POOL_SIZE
      ? Number(process.env.MONGODB_MAX_POOL_SIZE)
      : 20,
    retryWrites: true,
  },
}));
