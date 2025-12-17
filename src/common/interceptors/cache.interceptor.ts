import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';
import { RedisService } from '../../modules/cache/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const key = `cache:${request.originalUrl}`;

    const cached = await this.redis.get(key);
    if (cached) {
      return of(JSON.parse(cached) as unknown);
    }

    return next.handle().pipe(
      tap((response) => {
        void this.redis.set(key, JSON.stringify(response));
      }),
    );
  }
}
