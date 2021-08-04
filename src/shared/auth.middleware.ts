import { NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { JwtsService } from '@lib/jwts/jwts.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtsService: JwtsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //console.log(req)
    //const context = {req: Request, res: Response};
    //const ctx = GqlExecutionContext.create(context).getInfo();
    /*console.log(req);
        if(!req.headers.authorization) throw new HttpException('Unautorized access', HttpStatus.UNAUTHORIZED);

        console.log('middleware: ');
        req.user = await this.validateToken(req.headers.authorization);
        */
    next();
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    const token = auth.split(' ')[1];
    //console.log('token', token);
    try {
      const result = await this.jwtsService.verifyToken(token);
      //console.log('result: ', result)
      return result;
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
