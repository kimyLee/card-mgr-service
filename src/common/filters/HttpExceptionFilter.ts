/*
 * 全局过滤器 - 处理错误信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-02-21 15:07:18
 * @Description:
 *
 */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
  LoggerService,
  HttpException,
  BadRequestException,
} from '@nestjs/common';

import { AppError } from '../error/AppError';
import { Request, Response } from 'express';
import { ScriptError } from '../error/ScriptError';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    // Get the location where the error was thrown from to use as a logging tag
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const method = req.method;
    const url = req.url;
    const requestTime = Number(req.params.requestTime) || 0;
    if (exception.stack) {
      const stackTop = exception.stack
        .split('\n')[1]
        ?.split('at ')[1]
        ?.split(' ')[0];
      this.logger.log(
        `${method} ${url} - ${status} - ${Date.now() - requestTime}ms`,
        'Access',
      );
      this.logger.error(`${exception}`, stackTop, HttpExceptionFilter.name);
    }
    this.logger.error(
      `${req.originalUrl}`,
      req.rawHeaders.toString(),
      HttpExceptionFilter.name,
    );
    this.logger.error(
      `request payload:`,
      JSON.stringify(req.body),
      HttpExceptionFilter.name,
    );
    /* 自定义异常处理 */
    if (exception instanceof AppError) {
      return res.status(exception.httpStatus).json({
        data: [],
        code: exception.errorCode,
        message: exception.errorMessage,
      });
    } else if (exception instanceof UnauthorizedException) {
      /* 未授权异常 */
      return res.status(HttpStatus.UNAUTHORIZED).json({
        data: [],
        code: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
    } else if (exception instanceof BadRequestException) {
      /* 参数验证异常, 如 `class-validator` 抛出的 */
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: exception.response.meta,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      });
    } else if (exception.status === 403) {
      /* 权限验证异常 */
      return res.status(HttpStatus.FORBIDDEN).json({
        data: [],
        code: HttpStatus.FORBIDDEN,
        message: exception.message,
      });
    } else if (exception instanceof ScriptError) {
      /* 脚本异常 */
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: {
          exit: exception.exitCode,
        },
        code: 600,
        message: exception.message ? exception.message : exception,
      });
    } else {
      /* 其他异常 */
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: [],
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message ? exception.message : exception,
      });
    }
  }
}
