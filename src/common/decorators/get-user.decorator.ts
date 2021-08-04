import { createParamDecorator } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';
export const GetUser = createParamDecorator((_, req) => {
  return req[2].req.user;
});
