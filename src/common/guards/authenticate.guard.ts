import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Redis } from 'ioredis';

import { InjectIORedis } from '@lib/ioredis';
import { JwtsService } from '@lib/jwts/jwts.service';

/**
 * The verification of the credentials of the connection attempt. Or the act of logging a user in.
 * @description https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
 */
export const Authenticate = () => UseGuards(AuthenticateGuard);

@Injectable()
class AuthenticateGuard implements CanActivate {
  constructor(private jwtsService: JwtsService, @InjectIORedis() private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();

      const authorization = req.headers['api-key'] || '';
      if (!authorization) throw new UnauthorizedException('Invalid api-key');
      const redisResult = await this.redis.get(authorization);
      if (!redisResult) throw new UnauthorizedException('Invalid api-key');
      // check token on redis here ...
      await this.jwtsService.verifyToken(authorization);
      // TODO: checked if database is SQL or NoSQL
      // const devDoc = await this.devService.findUser({ authKey });
      // if (!devDoc) return new NotFoundException('AuthKey not found');
      // if (devDoc.status != T.StatusEnum.ACTIVE) return new NotAcceptableException('AuthKey not acceptable');
      // if (!devDoc.verifyStatus) return new BadRequestException('AuthKey is not verified yet');
      return true;
    } catch (e) {
      throw new UnauthorizedException(e.response.message);
    }
  }
}
