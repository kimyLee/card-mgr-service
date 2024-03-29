import { PointsService } from './../points/points.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
import { Like, Repository } from 'typeorm';

import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';
import { AppError } from '@/common/error/AppError';

import { BatchEntity } from './entities/batch.entity';

import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchesPaginatedDto } from './dto/batches-pagination.dto';

@Injectable()
export class BatchesService {
  constructor(
    @Inject(forwardRef(() => PointsService))
    private readonly pointsService: PointsService,

    @InjectRepository(BatchEntity)
    private readonly batchesRepository: Repository<BatchEntity>,
  ) {}

  async createBatch(createBatchDto: CreateBatchDto) {
    await this.checkBatchExitsByNameReturnBatch(createBatchDto.batch_name);
    const point = await this.pointsService.queryPoint(createBatchDto.point_id);
    const batch = new BatchEntity();
    batch.point = point;
    delete createBatchDto.point_id;
    Object.assign(batch, createBatchDto);

    return await this.batchesRepository.save(batch);
  }

  async updateBatch(id: number, updateBatchDto: UpdateBatchDto) {
    // check batch_name exits
    await this.checkBatchExitsByNameReturnBatch(updateBatchDto.batch_name);

    const { affected } = await this.batchesRepository.update(
      id,
      updateBatchDto,
    );

    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }
  }

  /**
   * @param batchesPaginatedDto: BatchesPaginatedDto
   */
  async queryAllBatches(batchesPaginatedDto: BatchesPaginatedDto) {
    let findWhere: any = {};

    const { search, pageSize, current } = batchesPaginatedDto;
    if (typeof search === 'string') {
      findWhere = [
        {
          batch_name: Like(`%${search}%`),
          ...findWhere,
        },
      ];
    }

    const [data, total] = await this.batchesRepository.findAndCount({
      relations: ['point'],
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

  async queryGroupBatches() {
    return await this.batchesRepository.find({
      select: ['batch_name', 'id'],
    });
  }

  /**
   *
   * @param id
   */
  async queryBatch(id: number) {
    const batch = await this.batchesRepository.findOne({
      where: {
        id,
      },
    });
    if (!batch) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }
    return batch;
  }

  async deleteBatch(id: number) {
    const { affected } = await this.batchesRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }
  }

  // check 批次名是否存在
  async checkBatchExitsByNameReturnBatch(batch_name: string) {
    const batch = await this.batchesRepository.findOne({
      where: {
        batch_name,
      },
    });

    if (batch) {
      throw new AppError(AppErrorTypeEnum.BATCH_EXITS);
    }
  }

  // check 码点库是否关联了批次信息
  async checkPointBindBatch(point_id) {
    const batch = await this.batchesRepository.findOne({
      where: {
        point_id,
      },
    });

    if (batch) {
      throw new AppError(AppErrorTypeEnum.POINT_BIND_BATCH);
    }
  }
}
