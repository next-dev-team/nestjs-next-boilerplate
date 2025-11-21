import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@lib/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    this.logger.debug(`Incoming Request: ${method} ${url}`, 'LoggingInterceptor');

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        this.logger.debug(
          `Outgoing Response: ${method} ${url} ${response.statusCode} - ${delay}ms`,
          'LoggingInterceptor'
        );
      })
    );
  }
}
