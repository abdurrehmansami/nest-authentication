import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status =
    //   exception instanceof HttpException
    //     ? exception.getStatus()
    //     : HttpStatus.INTERNAL_SERVER_ERROR;

    // const message = exception.message || 'Internal server error';

    // response.status(status).json({
    //   statusCode: status,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    //   message: message,
    // });
    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      // Here, we handle the validation error response with more details
      response.status(status).json({
        statusCode: status,
        message: exceptionResponse.message || 'Bad Request',
        error: exceptionResponse.error || 'Validation error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
