// 是否分页查询的枚举
export enum QueryPointsPagingEnum {
  YES = '1',
  NO = '0',
}

/**
 *
 * 码点库后台上传状态
 * await 0  等待上传
 * uploading 1 后台上传中
 * complete 2 上传完成
 * fail 3 上传失败
 */
export enum PointUploadStatus {
  AWAIT = 0,
  UPLOADING = 1,
  COMPLETE = 2,
  FAIL = 3,
}
