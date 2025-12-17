import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  ttl: number;
  maxRetriesPerRequest?: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly redisConfig: RedisConfig;

  constructor(private readonly config: ConfigService) {
    this.redisConfig = this.config.get<RedisConfig>('redis')!;
  }

  async onModuleInit() {
    this.client = new Redis({
      host: this.redisConfig.host,
      port: this.redisConfig.port,
      password: this.redisConfig.password,
      maxRetriesPerRequest: this.redisConfig.maxRetriesPerRequest ?? 3,
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiresIn = ttl ?? this.redisConfig.ttl;
    await this.client.setex(key, expiresIn, value);
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
