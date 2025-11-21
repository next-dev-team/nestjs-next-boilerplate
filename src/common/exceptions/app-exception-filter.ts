import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

import { i18next } from '@lib/i18next';

import { Translate } from '../types';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const i18n: i18next = host.switchToHttp().getRequest().i18n;
    const res = host.switchToHttp().getResponse<Response>();
    const statusCode = exception.getStatus();
    const response = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      error: string;
    };
    let message = Array.isArray(response.message) ? response.message[0] : response.message;
    //! keep backwards compatibility with current translate behavior
    message = Translate[message] ? i18n.t(Translate[message]) : message;

    // TODO: customize your own error handler
    // ======================================
    // ! Display log in server. Can also integrate with Mailer if want to alert to developer
    if (statusCode >= 500) {
      console.error(exception);
    } else {
      console.log(response);
    }

    const code = 'UNKNOWN';
    res.status(statusCode).json({ statusCode, message, code });
  }
}
