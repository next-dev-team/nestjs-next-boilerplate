import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// @Catch(HttpException)
// export class AppExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const gqlHost = GqlArgumentsHost.create(host);
//     console.log('host:', gqlHost);
//     const excFilter = exception.getResponse();
//     console.log('exception filter:', excFilter);
//     const { statusCode, message } = exception.getResponse() as { statusCode: number; error: string; message: any };
//     // console.log('res:', res);
//     return new HttpException({ statusCode, message }, statusCode);
//   }
// }

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();
    const response = exception.getResponse() as {
      statusCode: number;
      message: any;
      error: string;
    };
    console.log('statusCode:', statusCode);
    console.log('response:', response);
    const errors = response.message;
    console.log('error:', errors);

    const message = Array.isArray(errors)
      ? errors.map(err => Object.values(err.constraints)).reduce((acc, val) => acc.concat(val), [])[0]
      : response.message;
    console.log('message:', message);
    // TODO: customize your own error handler
    // ======================================

    // ! Display log in server. Can also integrate with Mailer if want to alert to developer
    if (statusCode >= 500) {
      console.error(exception);
    } else {
      console.log(response.message);
    }
    return new HttpException({ statusCode, message }, statusCode);
  }
}

// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import { Response } from 'express';

// @Catch(HttpException)
// export class AppExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const res = host.switchToHttp().getResponse<Response>();

//     const statusCode = exception.getStatus();
//     const response = exception.getResponse() as { statusCode: number; message: string | string[]; error: string };
//     const message = Array.isArray(response.message) ? response.message[0] : response.message;

//     // TODO: customize your own error handler
//     // ======================================

//     // ! Display log in server. Can also integrate with Mailer if want to alert to developer
//     if (statusCode >= 500) {
//       console.error(exception);
//     } else {
//       console.log(response);
//     }

//     res.status(statusCode).json({ statusCode, message });
//   }
// }
