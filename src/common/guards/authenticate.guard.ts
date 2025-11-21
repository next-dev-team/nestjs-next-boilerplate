import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@lib/jwt';

import { IXAuthUser } from '../decorators';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * The act of verifying the access rights of a user to interact with a resource.
 * @description https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
 */
export const Authenticate = () => UseGuards(AuthenticateGuard);

@Injectable()
export class AuthenticateGuard implements CanActivate {
  private readonly logger = new Logger(AuthenticateGuard.name);
  constructor(
    private jwtsService: JwtService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext) {
    // check is required device info
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    const payload = {} as IXAuthUser;

    if (isPublic) {
      // if there is token
      const authorization = request.headers['authorization'] || '';
      if (authorization) {
        if (!authorization.startsWith('Bearer')) {
          this.logger.warn('Invalid authorization header format for public route');
          throw new UnauthorizedException('Invalid token');
        }
        // decode
        try {
          // verify token
          const token = authorization.substr(7);
          const decoded = await this.jwtsService.verifyAsync<IXAuthUser>(token);
          payload.id = decoded.id;
          payload.roles = decoded.roles;
          this.logger.debug(`Public route accessed with valid token by user: ${payload.id}`);
        } catch (error) {
          this.logger.error(
            `Failed to decode token for public route: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
      request.user = payload;
      return true;
    }

    const authorization = request.headers['authorization'] || '';
    if (!authorization) {
      this.logger.warn('Authorization header not provided for protected route');
      throw new UnauthorizedException('not provided authorization');
    }
    if (!authorization.startsWith('Bearer')) {
      this.logger.warn('Invalid authorization header format for protected route');
      throw new UnauthorizedException('Invalid token');
    }
    const token = authorization.substr(7);
    try {
      // verify token
      const decoded = await this.jwtsService.verifyAsync<IXAuthUser>(token);
      // TODO:: can add on external validate authorization here
      payload.id = decoded.id;
      payload.roles = decoded.roles;
      request.user = payload;
      this.logger.debug(`Protected route accessed by user: ${payload.id} with roles: ${payload.roles.join(', ')}`);
      return true;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      const errorStack = e instanceof Error ? e.stack : undefined;
      this.logger.error(`Token verification failed: ${errorMessage}`, errorStack);
      //@ts-ignore
      throw new UnauthorizedException(e?.response?.message || 'Token verification failed');
    }
  }
}
