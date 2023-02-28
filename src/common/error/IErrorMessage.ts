import { HttpStatus } from '@nestjs/common';

export interface IErrorMessage {
  /** 指定HTTPCode, 默认为 200 */
  httpStatus?: HttpStatus;
  errorMessage: string;
}
