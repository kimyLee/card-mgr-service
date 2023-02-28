import { AppErrorTypeEnum } from './AppErrorTypeMap';
import { IErrorMessage } from './IErrorMessage';
import { HttpStatus } from '@nestjs/common';
import AppErrorTypeMap from './AppErrorTypeMap';

export class AppError extends Error {
  public errorCode: AppErrorTypeEnum;
  public httpStatus: number;
  public errorMessage: string;
  public userMessage: string;

  constructor(errorCode: AppErrorTypeEnum) {
    super();

    const errorMessageConfig: IErrorMessage = this.getError(errorCode);

    if (!errorMessageConfig) {
      throw new Error('Unable to find message code error.');
    }

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.errorCode = errorCode;
    this.errorMessage = errorMessageConfig.errorMessage;
    // 业务层的异常最好不用HTTPCode做区分
    this.httpStatus = errorMessageConfig.httpStatus
      ? errorMessageConfig.httpStatus
      : HttpStatus.OK;
  }

  private getError(errorCode: AppErrorTypeEnum): IErrorMessage {
    const res: IErrorMessage = AppErrorTypeMap[errorCode];
    return res;
  }
}
