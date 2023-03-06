interface AppErrorType {
  [key: string]: {
    errorMessage: string;
    httpStatus?: number;
  };
}

/** 错误枚举 */
export const enum AppErrorTypeEnum {
  /** 数据验证失败 */
  VALIDATOR_ERROR = 400,

  /** 用户 */
  USER_NOT_FOUND = 10001,
  USER_EXISTS,
  NO_USERS_IN_DB,
  NOT_MODIFY_SUP,
  NOT_MODIFY_CURRENT,
  USER_FORBIDDEN,
}

/** 错误枚举 */
const AppErrorTypeMap: AppErrorType = {
  [AppErrorTypeEnum.VALIDATOR_ERROR]: {
    errorMessage: 'Validation failed',
    httpStatus: 400,
  },
  [AppErrorTypeEnum.USER_NOT_FOUND]: {
    errorMessage: 'User not found',
  },
  [AppErrorTypeEnum.USER_EXISTS]: {
    errorMessage: 'User exists',
  },
  [AppErrorTypeEnum.NO_USERS_IN_DB]: {
    errorMessage: 'No User exits in the database',
  },

  [AppErrorTypeEnum.NOT_MODIFY_SUP]: {
    errorMessage: 'No modify super user',
  },

  [AppErrorTypeEnum.NOT_MODIFY_CURRENT]: {
    errorMessage: 'No modify current user',
  },

  [AppErrorTypeEnum.USER_FORBIDDEN]: {
    errorMessage: 'use forbidden',
  },
};

export default AppErrorTypeMap;
