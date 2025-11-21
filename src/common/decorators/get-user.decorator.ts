import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IXAuthUser } from './interfaces';

export const GetUser = createParamDecorator((data: keyof IXAuthUser | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
