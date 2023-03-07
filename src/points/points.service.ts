import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository } from 'typeorm';

import { PointEntity } from './entities/point.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';
import { PointsPaginatedDto } from './dto/points-pagination.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(PointEntity)
    private readonly pointsRepository: Repository<PointEntity>,
  ) {}

  async createPoint(createPointDto: CreatePointDto) {
    return this.pointsRepository.save(createPointDto);
  }

  async updatePoint(id: number, updatePointDto: UpdatePointDto) {
    return await this.pointsRepository.update(id, updatePointDto);
  }

  /**
   * @param pointsPaginatedDto: PointsPaginatedDto
   */
  async queryAllPoints(pointsPaginatedDto: PointsPaginatedDto): Promise<any> {
    let findWhere: any = {};

    const { search, pageSize, current } = pointsPaginatedDto;
    if (typeof search === 'string') {
      findWhere = [
        {
          id: Like(`%${search}%`),
          ...findWhere,
        },
        // or..
        // {
        //   username: Like(`%${search}%`),
        //   ...findWhere,
        // },
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
  }

  /**
   *
   * @param id
   */
  queryPoint(id: number): Promise<any> {
    return this.pointsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deletePoint(id: number): Promise<any> {
    const { affected } = await this.pointsRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.POINT_NOT_FOUND);
    }
  }
}
