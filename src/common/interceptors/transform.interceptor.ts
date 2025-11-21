import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly classType: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data =>
        plainToInstance(this.classType, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      )
    );
  }
}
