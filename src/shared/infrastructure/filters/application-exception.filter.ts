import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../domain/exceptions/application.exception';
import type { Request, Response } from 'express';

const httpStatusMap: Record<ApplicationExceptionStatus, HttpStatus> = {
  [ApplicationExceptionStatus.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ApplicationExceptionStatus.INTERNAL_SERVER]:
    HttpStatus.INTERNAL_SERVER_ERROR,
  [ApplicationExceptionStatus.CONFLICT]: HttpStatus.CONFLICT,
  [ApplicationExceptionStatus.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  [ApplicationExceptionStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ApplicationExceptionStatus.FORBIDDEN]: HttpStatus.FORBIDDEN,
};

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    // access the request and response
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.code;

    // access the exception status and response message
    const exceptionStatus = httpStatusMap[status];
    const exceptionMessage = exception.message;

    // send the response back
    response.status(exceptionStatus).json({
      statusCode: exceptionStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionMessage,
    });
  }
}
