import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const I18Next = createParamDecorator((args: unknown, ctx: ExecutionContext) => {
  // console.log('ctx:', ctx.switchToHttp().getRequest().i18n);
  return ctx.switchToHttp().getRequest().i18n;
});
