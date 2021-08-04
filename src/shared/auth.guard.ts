import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { JwtsService } from '@lib/jwts/jwts.service';

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private jwtsService: JwtsService) {}

  async canActivate(context: ExecutionContext) {
    //const {req, res, payload, connection} = GqlExecutionContext.create(context).getContext();
    const ctx = GqlExecutionContext.create(context).getContext();
    //const ctx1 = context.switchToHttp();
    /*console.log("type: ", GqlExecutionContext.create(context).getType());
        console.log("root: ", GqlExecutionContext.create(context).getRoot());
        console.log("args: ", GqlExecutionContext.create(context).getArgs());
        console.log("context: ", GqlExecutionContext.create(context).getContext());
        console.log("info: ", GqlExecutionContext.create(context).getInfo());
        */
    //return true;
    if (!ctx.req.headers.authorization) return false;
    //console.log('req: ', ctx.req);
    //console.log(ctx.headers.authorization);
    //validate token
    ctx.user = await this.validateToken(ctx.req.headers.authorization);

    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    const token = auth.split(' ')[1];
    console.log('token', token);
    try {
      const result = await this.jwtsService.verifyToken(token);
      //console.log('result: ', result)
      return result;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
