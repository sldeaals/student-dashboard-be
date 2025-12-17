import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  <K extends keyof JwtPayload>(
    key: K | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | JwtPayload[K] | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const user = request.user;

    if (!user) {
      return undefined;
    }

    return key ? user[key] : user;
  },
);
