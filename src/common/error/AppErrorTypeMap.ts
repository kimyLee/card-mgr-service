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
  CARD_DELETE_BATCH_FAIL,
  CARD_IMPORT_BATCH_FAIL,

  XLSX_TYPE_ERROR,
  XLSX_NO_DATA,
  XLSX_DATA_MORE_THEN_POINT_UPLOAD_COUNT,

  ZIP_TYPE_ERROR,
  ZIP_NO_DATA,

  POINT_NOT_FOUND = 30001,
  POINT_EXTENT_DUPLICATION = 30002,
  POINT_BIND_BATCH,

  BATCH_NOT_FOUND = 40001,
  BATCH_EXITS,
  BATCH_NOT_CARDS,

  OSS_RES_ERROR = 90000,
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
    errorMessage: 'User forbidden',
  },

  [AppErrorTypeEnum.CARD_NOT_FOUND]: {
    errorMessage: 'Card not found',
  },

  [AppErrorTypeEnum.CARD_DELETE_BATCH_FAIL]: {
    errorMessage: 'Delete batch with cards fail',
  },

  [AppErrorTypeEnum.CARD_IMPORT_BATCH_FAIL]: {
    errorMessage: 'Import cards create batch fail',
  },

  [AppErrorTypeEnum.XLSX_TYPE_ERROR]: {
    errorMessage: 'Not xlsx',
  },
  [AppErrorTypeEnum.XLSX_NO_DATA]: {
    errorMessage: 'Empty xlsx',
  },

  [AppErrorTypeEnum.XLSX_DATA_MORE_THEN_POINT_UPLOAD_COUNT]: {
    errorMessage: '导入的批次卡牌数量超过该码点库剩余可分配的码点文件',
  },

  [AppErrorTypeEnum.ZIP_TYPE_ERROR]: {
    errorMessage: 'Not zip',
  },
  [AppErrorTypeEnum.ZIP_NO_DATA]: {
    errorMessage: 'Empty zip',
  },

  [AppErrorTypeEnum.POINT_NOT_FOUND]: {
    errorMessage: 'Point not found',
  },

  [AppErrorTypeEnum.POINT_EXTENT_DUPLICATION]: {
    errorMessage: 'Point extent duplication',
  },

  [AppErrorTypeEnum.POINT_BIND_BATCH]: {
    errorMessage: 'Point bind batch, can not removed',
  },

  [AppErrorTypeEnum.BATCH_NOT_FOUND]: {
    errorMessage: 'Batch not found',
  },

  [AppErrorTypeEnum.BATCH_EXITS]: {
    errorMessage: 'Batch exits',
  },

  [AppErrorTypeEnum.BATCH_NOT_CARDS]: {
    errorMessage: 'Batch not have cards',
  },

  [AppErrorTypeEnum.OSS_RES_ERROR]: {
    errorMessage: 'OSS response error',
  },
};

export default AppErrorTypeMap;
