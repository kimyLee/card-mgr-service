import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import * as promise from 'bluebird';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

import { PointsService } from '@/points/points.service';
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
    private readonly config: ConfigService,
  ) {}

  /**
   *  导入批次卡牌
   *  TODO:  处理 excel 的原始数据 check 数据合法
   *  判断数据库是否存储过, 有则变更卡牌类型为复刻卡 √
   *  请求第三方 api  X 不需要
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

    const newData = await promise.map(
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
          // http://test-code-card.oss-cn-hongkong.aliyuncs.com/e88e6485-f53f-40de-9eb8-d696ac726c73/3_pbh_3x3.tif
          point_url: `${point.point_path}/${
            i + 1 + point.use_count
          }_pbh_3x3.tif`,
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

    const newBatch = await this.batchesService.createBatch(batch, point, true);

    newData.map((v) => (v.batch = newBatch));

    const res = await this.cardsRepository.save(newData);

    await this.pointsService.updatePoint(
      point.id,
      {
        use_count: point.use_count, // 更新 point 已分配给卡牌的数量
      },
      true,
    );

    return res;
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

    // or
    // return output;
  }

  /**
   * 向某一批次追加创建卡牌
   * @param createCardDto: CreateCardDto
   * TODO: 更新 batch 状态, point 状态
   */
  async createCard(createCardDto: CreateCardDto) {
    const batch = await this.batchesService.queryBatch(createCardDto.batch_id);
    if (!batch) {
      throw new AppError(AppErrorTypeEnum.BATCH_NOT_FOUND);
    }
    const card = new CardEntity();
    delete createCardDto.batch_id;
    card.batch = batch;
    Object.assign(card, createCardDto);

    return await this.cardsRepository.save(card);
  }

  async updateCard(id: number, updateCardDto: UpdateCardDto) {
    return await this.cardsRepository.update(id, updateCardDto);
  }

  /**
   * @param cardsPaginatedDto: CardsPaginatedDto
   * TODO: 条件筛选
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

    // return findWhere;

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

  async deleteCard(id: number) {
    const { affected } = await this.cardsRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.CARD_NOT_FOUND);
    }
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
}
