import { Injectable } from '@nestjs/common';
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
    @InjectRepository(BatchEntity)
    private readonly batchesRepository: Repository<BatchEntity>, // private configService: ConfigService,
  ) {}

  async createBatch(createBatchDto: CreateBatchDto) {
    return await this.batchesRepository.save(createBatchDto);
  }

  async updateBatch(id: number, updateBatchDto: UpdateBatchDto) {
    return await this.batchesRepository.update(id, updateBatchDto);
  }

  /**
   * @param batchesPaginatedDto: BatchesPaginatedDto
   */
  async queryAllBatches(
    batchesPaginatedDto: BatchesPaginatedDto,
  ): Promise<any> {
    let findWhere: any = {};

    const { search, pageSize, current } = batchesPaginatedDto;
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

    const [data, total] = await this.batchesRepository.findAndCount({
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
  queryBatch(id: number): Promise<any> {
    return this.batchesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteBatch(id: number): Promise<any> {
    const { affected } = await this.batchesRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }
  }
}
