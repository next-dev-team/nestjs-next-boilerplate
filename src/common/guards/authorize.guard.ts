import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

import { InjectIORedis } from '@lib/ioredis';

/**
 * The act of verifying the access rights of a user to interact with a resource.
 * @description https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
 */
export const Authorize = () => UseGuards(AuthorizeGuard);

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private jwtsService: JwtService,
    // private devService: DevelopersService,
    @InjectIORedis() private readonly redis: Redis
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      const authorization = req.headers['authorization'] || '';
      if (!authorization) throw new ForbiddenException('Invalid token');
      if (!authorization.startsWith('Bearer')) throw new ForbiddenException('Invalid token');
      const token = authorization.substr(7);
      // verify token
      const { id } = await this.jwtsService.verifyAsync(token);
      // check token on redis
      const redisResult = await this.redis.hgetall(id);
      const redisKeys = Object.keys(redisResult);
      if (!redisKeys.includes(token)) throw new ForbiddenException('Invalid token');
      // check user in db
      // const userDoc = await this.devService.findUser({ accessKey });
      // if (!userDoc) throw new ForbiddenException('Something went wrong');
      // if (!userDoc.verifyStatus) throw new ForbiddenException('Something went wrong');
      // if (userDoc.status != T.StatusEnum.ACTIVE) throw new ForbiddenException('Something went wrong');
      req.user = {};
      return req;
    } catch (e) {
      // @ts-ignore
      throw new ForbiddenException(e.response.message);
    }
  }
}
