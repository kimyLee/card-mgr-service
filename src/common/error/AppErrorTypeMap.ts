interface AppErrorType {
  [key: string]: {
    errorMessage: string;
    httpStatus?: number;
  };
}

/** 错误枚举 */
export const enum AppErrorTypeEnum {
  USER_NOT_FOUND,
  USER_EXISTS,
  NOT_IN_SESSION,
  /** 用户不存在 */
  NO_USERS_IN_DB,
  /** 数据验证失败 */
  VALIDATOR_ERROR,
}

/** 错误枚举 */
const AppErrorTypeMap: AppErrorType = {
  [AppErrorTypeEnum.USER_NOT_FOUND]: {
    errorMessage: 'User not found',
  },
  [AppErrorTypeEnum.USER_EXISTS]: {
    errorMessage: 'User exists',
  },
  [AppErrorTypeEnum.NOT_IN_SESSION]: {
    errorMessage: 'No Session',
  },
  [AppErrorTypeEnum.NO_USERS_IN_DB]: {
    errorMessage: 'No User exits in the database',
  },
  [AppErrorTypeEnum.VALIDATOR_ERROR]: {
    errorMessage: 'Validation failed',
    httpStatus: 400,
  },
};

export default AppErrorTypeMap;
