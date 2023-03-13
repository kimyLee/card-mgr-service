import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

import { PointEntity } from './entities/point.entity';
import { CreatePointDto, QueryPointsPagingEnum } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

import { PointsPaginatedDto } from './dto/points-pagination.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointsRepository: Repository<PointEntity>,
  ) {}

  async createPoint(createPointDto: CreatePointDto) {
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
        throw new Error('区间重复');
      }
    }
    // save
    const point = new PointEntity();
    Object.assign(point, createPointDto);

    return this.pointsRepository.save(point);
  }

  async updatePoint(id: number, updatePointDto: UpdatePointDto) {
    await this.queryPoint(id); // 是判断id 是否存在
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
}
