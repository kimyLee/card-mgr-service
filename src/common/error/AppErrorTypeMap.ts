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

  CARD_NOT_FOUND = 20001,
  FILE_TYPE_ERROR = 20002,
  FILE_NO_DATA = 20003,

  POINT_NOT_FOUND = 30001,

  BATCH_NOT_FOUND = 40001,
  BATCH_EXITS = 40002,
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

  [AppErrorTypeEnum.CARD_NOT_FOUND]: {
    errorMessage: 'card not found',
  },

  [AppErrorTypeEnum.FILE_TYPE_ERROR]: {
    errorMessage: 'file type error',
  },
  [AppErrorTypeEnum.FILE_NO_DATA]: {
    errorMessage: 'file no data',
  },

  [AppErrorTypeEnum.POINT_NOT_FOUND]: {
    errorMessage: 'point not found',
  },

  [AppErrorTypeEnum.BATCH_NOT_FOUND]: {
    errorMessage: 'batch not found',
  },

  [AppErrorTypeEnum.BATCH_EXITS]: {
    errorMessage: 'batch exits',
  },
};

export default AppErrorTypeMap;
