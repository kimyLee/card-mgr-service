import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, Connection } from 'typeorm';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import * as promise from 'bluebird';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

import { OssService } from '@/oss/oss.service';
import { PointsService } from '@/points/points.service';
import { PointEntity } from '@/points/entities/point.entity';
import { BatchEntity } from '@/batches/entities/batch.entity';
import { BatchesService } from '@/batches/batches.service';

import { CardEntity } from './entities/card.entity';
import { CardTypeEnum } from './types/cards.type';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsPaginatedDto } from './dto/cards-pagination.dto';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileDownloadDto } from './dto/file-download.dto';

const xlsxContentType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
    private readonly batchesService: BatchesService,
    private readonly pointsService: PointsService,
    private readonly ossService: OssService,
    private readonly config: ConfigService,
    private connection: Connection,
  ) {}

  /**
   *  导入批次卡牌
   *  处理 excel 的原始数据, check 数据合法
   *  判断数据库是否存储过, 有则变更卡牌类型为复刻卡 √
   *
   */
  async importCardsCreateBatch(
    file: Express.Multer.File,
    fileUploadDto: FileUploadDto,
  ) {
    await this.batchesService.checkBatchExitsByNameReturnBatch(
      fileUploadDto.batch_name,
    );

    const point = await this.pointsService.queryPoint(fileUploadDto.point_id);

    // check point exits
    const batch = new BatchEntity();

    batch.point = point;

    // 判断文件类型;
    if (file.mimetype.indexOf(xlsxContentType) <= -1) {
      // 不是 excel 文件
      throw new AppError(AppErrorTypeEnum.XLSX_TYPE_ERROR);
    }
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
    });

    /* Get the work sheet name */
    const first_sheet_name = workbook.SheetNames[0];

    /* Get worksheet */
    const worksheet = workbook.Sheets[first_sheet_name];

    /* Convert it to json*/
    const xlsData = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
    });
    if (!xlsData.length) {
      throw new AppError(AppErrorTypeEnum.XLSX_NO_DATA);
    }

    if (point.upload_count - point.use_count < xlsData.length) {
      throw new AppError(
        AppErrorTypeEnum.XLSX_DATA_MORE_THEN_POINT_UPLOAD_COUNT,
      );
    }

    let new_count = 0;

    // const region = this.config.get<string>('ossConfig.region');
    // const bucket = this.config.get<string>('ossConfig.bucket');

    const newData: CardEntity[] = await promise.map(
      xlsData,
      async (v, i) => {
        const card = new CardEntity();

        const exitCard = await this.findCardByCaseNo(v['卡牌编号']);

        if (!exitCard) {
          new_count = new_count + 1;
        }

        const type = exitCard ? CardTypeEnum.REPRINT : CardTypeEnum.NEW_ADD;

        return {
          ...card,
          case_no: v['卡牌编号'],
          card_name: v['卡牌名称'],
          ip: v['IP'] || v['ip'],
          series: v['版本'],
          amount: v['弹数'],
          point_value: v['码点值'],
          type,
          // http://${region}.${bucket}.aliyuncs.com/
          // http://test-code-card.oss-cn-hongkong.aliyuncs.com/
          original_point_url: `${point.point_path}/${
            i + 1 + point.use_count
          }.tif`,
        };
      },
      // { concurrency: 5 },
    );

    // 批次新增总数
    const count = newData.length;

    point.use_count = point.use_count + count;

    // 复刻卡数量
    const reprint_count = count - new_count;

    Object.assign(batch, {
      count,
      new_count,
      reprint_count,
      batch_name: fileUploadDto.batch_name,
    });

    // 获取连接并创建新的 queryRunner

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      batch.point = point;

      const newBatch = await queryRunner.manager.save(batch);

      await promise.map(newData, async (v) => {
        v.batch = newBatch;

        // await copy oss file copy
        const ossReplaceUrl = `${point.point_path}/${newBatch.id}/${v.case_no}.tif`;
        await this.ossService.copy(v.original_point_url, ossReplaceUrl);

        v.point_url = ossReplaceUrl;
      });

      //  更新 point 已分配给卡牌的数量
      await queryRunner.manager.update(PointEntity, batch.point_id, {
        use_count: point.use_count, //
      });

      // save cardsEntity[]
      await queryRunner.manager.save(CardEntity, newData);

      await queryRunner.commitTransaction();

      return newBatch;
    } catch (err) {
      // 有错误做出回滚更改
      console.log(err);

      await queryRunner.rollbackTransaction();
      throw new AppError(AppErrorTypeEnum.CARD_IMPORT_BATCH_FAIL);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  按批次查询卡牌
   */

  async queryCardsWithBatch(fileDownloadDto: FileDownloadDto) {
    const { batch_id = null } = fileDownloadDto;

    const data = await this.cardsRepository.find({
      relations: ['batch', 'batch.point'],
      where: {
        batch_id,
      },
    });

    if (!data.length) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_CARDS);
    }

    return data;
  }

  /**
   *  导出批次卡牌list
   */
  async exportCardsWithBatch(fileDownloadDto: FileDownloadDto, res: Response) {
    const { batch_id = null } = fileDownloadDto;

    const data = await this.cardsRepository.find({
      relations: ['batch', 'batch.point'],
      where: {
        batch_id,
      },
    });

    if (!data.length) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_CARDS);
    }

    // TODO: 导出表头格式

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const output = await XLSX.writeXLSX(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'buffer',
    });

    res.set({
      'Content-Type': xlsxContentType + ';charset=utf-8',
      'Content-Disposition': `attachment; filename=${encodeURIComponent(
        'export_cards',
      )}_${Date.now()}.xlsx`,
    });
    res.status(HttpStatus.CREATED).end(output);
  }

  /**
   * @param cardsPaginatedDto: CardsPaginatedDto
   */
  async queryAllCards(cardsPaginatedDto: CardsPaginatedDto) {
    let findWhere: any = {};

    const { search, ip, series, batch_id, pageSize, current } =
      cardsPaginatedDto;

    if (typeof ip === 'string') {
      findWhere = {
        ip,
        ...findWhere,
      };
    }

    if (typeof series === 'string') {
      findWhere = {
        series,
        ...findWhere,
      };
    }

    if (typeof +batch_id === 'number') {
      findWhere = {
        batch_id: +batch_id,
        ...findWhere,
      };
    }

    if (typeof search === 'string') {
      findWhere = [
        {
          case_no: Like(`%${search}%`),
          ...findWhere,
        },
        {
          card_name: Like(`%${search}%`),
          ...findWhere,
        },
      ];
    }

    const [data, total] = await this.cardsRepository.findAndCount({
      relations: ['batch', 'batch.point'],
      where: findWhere,
      take: pageSize,
      skip: (current - 1) * pageSize,
    });

    return {
      pagination: {
        current,
        pageSize,
        total: total,
      },
      results: data,
    };
  }

  /**
   *
   * @param id
   */
  async queryCard(id: number) {
    return await this.cardsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async queryGroupIp() {
    return await this.cardsRepository
      .createQueryBuilder('cards')
      .select('cards.ip as ip')
      .groupBy('cards.ip') // 等价于 .distinct(true)
      .getRawMany();
  }

  async queryGroupSeries() {
    return await this.cardsRepository
      .createQueryBuilder('cards')
      .select('cards.series as series')
      .groupBy('cards.series') // 等价于 .distinct(true)
      .getRawMany();
  }

  async findCardByCaseNo(case_no: string) {
    return await this.cardsRepository.findOne({
      where: {
        case_no,
      },
    });
  }

  /**
   * 向某一批次追加创建卡牌
   * @param createCardDto: CreateCardDto
   * TODO: 更新 batch 状态, point 状态
   */
  async createCard(createCardDto: CreateCardDto) {
    const batch = await this.batchesService.queryBatch(createCardDto.batch_id);
    const card = new CardEntity();
    delete createCardDto.batch_id;
    card.batch = batch;
    Object.assign(card, createCardDto);

    return await this.cardsRepository.save(card);
  }

  async updateCard(id: number, updateCardDto: UpdateCardDto) {
    return await this.cardsRepository.update(id, updateCardDto);
  }

  // TODO: 更新 batch 状态, point 状态
  async deleteCard(id: number) {
    const { affected } = await this.cardsRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.CARD_NOT_FOUND);
    }
  }

  /**
   * 软删除批次以及批次下所有卡牌, 重置 point.useCount
   */
  async deleteBatchWithCards(batch_id: number) {
    // 获取连接并创建新的 queryRunner
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const batchCardsCount = await queryRunner.manager.countBy(CardEntity, {
      batch_id,
    });

    const batch = await queryRunner.manager.findOneBy(BatchEntity, {
      id: batch_id,
    });

    if (!batch) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }

    // 查询对应码点库
    // 等价于 const point = await queryRunner.manager.findOneBy(PointEntity, { id: batch.point_id, });
    batch.point = await queryRunner.manager
      .createQueryBuilder()
      .relation(BatchEntity, 'point')
      .of(batch)
      .loadOne();

    if (!batch.point) {
      throw new AppError(AppErrorTypeEnum.POINT_NOT_FOUND);
    }

    // return batch;

    try {
      // 对此事务执行一些操作

      // 重置 point, useCount
      await queryRunner.manager.update(PointEntity, batch.point_id, {
        use_count: batch.point.use_count - batchCardsCount,
      });

      // 删除该批次所有卡牌
      await queryRunner.manager.softDelete(CardEntity, { batch_id });

      // 删除批次
      await queryRunner.manager.softDelete(BatchEntity, { id: batch_id });

      // 删除 对应 oss/point/batch_id/*.tif 先保留
      // await this.ossService.deletePrefix(
      //   `${batch.point.point_path}/${batch.id}/`,
      // );

      // 提交事务：
      await queryRunner.commitTransaction();

      //
    } catch (err) {
      // 有错误做出回滚更改
      await queryRunner.rollbackTransaction();
      throw new AppError(AppErrorTypeEnum.CARD_DELETE_BATCH_FAIL);
    } finally {
      await queryRunner.release();
    }
  }

  //
}
