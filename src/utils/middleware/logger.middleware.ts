import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //console.log('Request...', req);
    /*const data = req.body.query.split(' ');
    console.log(data);*/
    next();
  }
}
