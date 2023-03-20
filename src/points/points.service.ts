import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';
import { OssService } from '@/oss/oss.service';

import { PointEntity } from './entities/point.entity';
import { QueryPointsPagingEnum } from './types/point.type';

import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointsPaginatedDto } from './dto/points-pagination.dto';

// import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

const zipContentType = 'application/zip';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointsRepository: Repository<PointEntity>,
    private readonly ossService: OssService,
  ) {}

  async createPoint(createPointDto: CreatePointDto, file: Express.Multer.File) {
    const startTime = Date.now();
    const { mimetype, buffer } = file;
    // 判断文件类型;
    if (mimetype.indexOf(zipContentType) <= -1) {
      // 不是 zip 文件
      throw new AppError(AppErrorTypeEnum.ZIP_TYPE_ERROR);
    }

    const zip = new AdmZip(buffer);

    let zipEntries = zip.getEntries();

    // mac默认的归档功能 会创建 __MACOSX 目录 以及 .DS_Store 文件， 手动过滤一下, 并且过滤 非 .tif 结尾的文件
    zipEntries = zipEntries.filter(
      (v) =>
        !v.isDirectory &&
        v.entryName.indexOf('__MACOSX') <= -1 &&
        v.entryName.indexOf('.DS_Store') <= -1 &&
        /\.(tif)$/.test(v.entryName),
    );

    const allUploadCount = zipEntries.length;

    if (!allUploadCount) {
      throw new AppError(AppErrorTypeEnum.ZIP_NO_DATA);
    }

    // check point 区间重复
    const points = await this.pointsRepository.find({
      select: ['id', 'extent_max', 'extent_min', 'upload_status'],
    });
    if (points.length > 0) {
      let isDuplication = false;
      const { extent_max, extent_min } = createPointDto;
      for (let i = 0; i < points.length; i++) {
        if (
          (extent_max >= points[i].extent_min &&
            extent_max <= points[i].extent_max) ||
          (extent_min >= points[i].extent_min &&
            extent_min <= points[i].extent_max)
        ) {
          isDuplication = true;
          break;
        }
      }
      if (isDuplication) {
        throw new AppError(AppErrorTypeEnum.POINT_EXTENT_DUPLICATION);
      }
    }

    const point = new PointEntity();

    // 创建 oss prefix
    const point_path = uuidV4();

    /**
     * 批量上传oss
     * TODO: 文件重名
     * 性能优化 队列
     *
     * */
    const ossRes = await Promise.all(
      zipEntries.map((v) =>
        this.ossService.putBuffer(point_path + '/' + v.name, v.getData()),
      ),
    );

    let ossUploadFail = 0;

    const ossFail = ossRes.filter((v) => {
      if (!v?.url) {
        ossUploadFail = ossUploadFail + 1;
        return v;
      }
    });

    if (ossFail.length) {
      throw {
        msg: '`解析zip资源包上传OSS失败部分失败, 请资源目录后重试',
        timeConsuming: `${Date.now() - startTime}ms`,
        allUploadCount,
        ossUploadSucceed: allUploadCount - ossUploadFail,
        ossUploadFail,
        ossFail,
        ossRes,
      };
    }

    Object.assign(point, createPointDto, {
      point_path, // 生成 uuid 对应 oss prefix
      upload_count: allUploadCount, // 上传到 oss 的文件数量
    });

    const savePoint = await this.pointsRepository.save(point);

    return {
      ...savePoint,
      oss: {
        ossUploadSucceed: allUploadCount,
        timeConsuming: `${Date.now() - startTime}ms`,
        ossRes,
      },
    };
  }

  async updatePoint(
    id: number,
    updatePointDto: UpdatePointDto,
    skipCheck = false,
  ) {
    if (!skipCheck) {
      await this.queryPoint(id); // 是判断id 是否存在
    }

    return await this.pointsRepository.update(id, updatePointDto);
  }

  /**
   * @param pointsPaginatedDto: PointsPaginatedDto
   */
  async queryAllPoints(pointsPaginatedDto: PointsPaginatedDto) {
    if (pointsPaginatedDto.paging === QueryPointsPagingEnum.YES) {
      let findWhere: any = {};

      const { search, pageSize, current } = pointsPaginatedDto;
      if (typeof search === 'string') {
        findWhere = [
          {
            point_path: Like(`%${search}%`),
            ...findWhere,
          },
        ];
      }

      const [data, total] = await this.pointsRepository.findAndCount({
        where: findWhere,
        take: pageSize,
        skip: (current - 1) * pageSize,
      });

      return {
        results: data,
        pagination: {
          current,
          pageSize,
          total: total,
        },
      };
    } else {
      const data = await this.pointsRepository.find({
        select: ['id', 'extent_max', 'extent_min', 'upload_status'],
      });

      return {
        results: data,
      };
    }
  }

  /**
   *
   * @param id
   */
  async queryPoint(id: number) {
    const data = await this.pointsRepository.findOne({
      where: {
        id,
      },
    });
    if (data) {
      return data;
    } else {
      throw new AppError(AppErrorTypeEnum.POINT_NOT_FOUND);
    }
  }

  async deletePoint(id: number) {
    const { affected } = await this.pointsRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.POINT_NOT_FOUND);
    }
  }

  async test() {
    // const res = await this.ossService.putOssFile(
    //   'test/1111_pbh_3x3.tif',
    //   './upload/1_pbh_3x3.tif',
    // );
    // console.log(res);
    // const res = fs.readdirSync('./');
    // console.log(res);

    const res = await this.ossService.listFiles();

    return res;
  }
}
