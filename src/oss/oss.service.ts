/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as OSS from 'ali-oss';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

// http://test-code-card.oss-cn-hongkong.aliyuncs.com/test/1111_pbh_3x3.tif?x-oss-process=image/resize,w_100

@Injectable()
export class OssService {
  client: OSS;
  constructor(private config: ConfigService) {
    this.client = new OSS({
      accessKeyId: this.config.get<string>('ossConfig.accessKeyId'),
      accessKeySecret: this.config.get<string>('ossConfig.accessKeySecret'),
      region: this.config.get<string>('ossConfig.region'),
      bucket: this.config.get<string>('ossConfig.bucket'),
    });

    // 创建存储桶？
    // this.putBucket()
  }

  // 创建存储空间。
  async putBucket(bucketName = 'test-code-card') {
    try {
      // const options = {
      //   storageClass: 'Archive', // 存储空间的默认存储类型为标准存储，即Standard。如果需要设置存储空间的存储类型为归档存储，请替换为Archive。
      //   acl: 'public-read', // 存储空间的默认读写权限为私有，即private。如果需要设置存储空间的读写权限为公共读，请替换为public-read。
      //   dataRedundancyType: 'ZRS', // 存储空间的默认数据容灾类型为本地冗余存储，即LRS。如果需要设置数据容灾类型为同城冗余存储，请替换为ZRS。
      // };
      const { bucket } = await this.client.putBucket(bucketName);
      return bucket;
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
  }

  // 列举所有的存储空间
  async listBuckets() {
    try {
      // @ts-ignore
      const { buckets } = await this.client.listBuckets();
      return buckets;
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
  }

  // 列举所有的文件
  async listFiles() {
    try {
      // 不带任何参数，默认最多返回100个文件。
      // @ts-ignore
      const { objects = [] } = await this.client.list();
      return objects;
    } catch (err) {
      return err;
    }
  }

  /**
   *
   * 填写目录名称，目录需以正斜线结尾。
   * @param targeName
   * @param buffer
   * @example  putBuffer('exampleDir/') 创建空目录
   * @example  putBuffer('exampleDir/test.tif', buffer) 上传本地内存到 oss
   *
   * */

  async putBuffer(targeName: string, buffer: Buffer = Buffer.from('')) {
    try {
      //
      const { name, url } = await this.client.put(targeName, buffer);
      return {
        name,
        url,
      };
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
  }

  // 处理请求失败的情况，防止promise.all中断，并返回失败原因和失败文件名。
  async handleDel(name) {
    try {
      await this.client.delete(name);
    } catch (error) {
      error.failObjectName = name;
      return error;
    }
  }

  /**
   *
   * 删除目录及目录下的所有文件。
   * 填写目录名称，目录需以正斜线结尾。
   * @use deletePrefix('log/')
   *
   * 删除目录会同步删除目录下包含的子目录以及所有文件，请谨慎操作。
   * */
  async deletePrefix(prefix) {
    try {
      // @ts-ignore
      const { objects = [] } = await this.client.list({
        prefix: prefix,
      });

      if (objects.length > 0) {
        const res = await Promise.all(
          objects.map((v) => this.handleDel(v.name)),
        );
        return res;
      } else {
        return null;
      }
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
  }

  // 在同一个Bucket中拷贝文件。
  async copy(sourceName: string, targeName: string) {
    try {
      return await this.client.copy(targeName, sourceName);
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
  }

  // 上传文件到oss 并返回  图片oss 地址
  async putOssFile(ossPath: string, localPath: string): Promise<string> {
    let res: any;
    try {
      res = await this.client.put(ossPath, localPath);
      // 将文件设置为公共可读
      // await this.client.putACL(ossPath, 'public-read');
      // return res;
    } catch (err) {
      throw new AppError(AppErrorTypeEnum.OSS_RES_ERROR);
    }
    return res.url;
  }

  /**
   * 获取文件的url
   * @param filePath
   */
  async getFileSignatureUrl(filePath: string): Promise<string> {
    if (filePath == null) {
      // console.log('get file signature failed: file name can not be empty');
      return null;
    }
    let result = '';
    try {
      result = this.client.signatureUrl(filePath, { expires: 36000 });
    } catch (err) {}
    return result;
  }

  /**
   * 上传文件大小校验
   * @param localPath
   * @param ossPath
   * @param size
   */
  async validateFile(
    ossPath: string,
    localPath: string,
    size: number,
  ): Promise<string> {
    if (size > 5 * 1024 * 1024) {
      return;
    } else {
      return await this.putOssFile(ossPath, localPath);
    }
  }

  test() {
    return this.listFiles();
  }
}
