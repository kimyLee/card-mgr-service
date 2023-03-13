import { BatchesService } from './../batches/batches.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Express, Response } from 'express';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

import { CardEntity } from './entities/card.entity';

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
  ) {}

  async importCards(file: Express.Multer.File, fileUploadDto: FileUploadDto) {
    // 判断文件类型;
    if (file.mimetype.indexOf(xlsxContentType) <= -1) {
      // 不是 excel 文件
      throw new AppError(AppErrorTypeEnum.FILE_TYPE_ERROR);
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
      throw new AppError(AppErrorTypeEnum.FILE_TYPE_ERROR);
    }

    /**
     *  TODO: 处理 excel 的原始数据
     *  check 数据合法
     *  判断数据库是否存储过, 有则变更卡牌类型为复刻卡
     *  请求第三方 api
     *  sava
     */
    // save

    return {
      fileUploadDto: fileUploadDto,
      file: {
        fieldname: file.fieldname,
        originalname: file.originalname,

        mimetype: file.mimetype,
        size: file.size,
      },
      data: xlsData,
    };
  }

  async exportCardsWithPoint(fileDownloadDto: FileDownloadDto, res: Response) {
    // TODO 导出的表头
    const { ids = [], batch_id = null } = fileDownloadDto;

    let data: CardEntity[] = [];

    if (batch_id) {
      data = await this.cardsRepository.find({
        relations: ['batch', 'batch.point'],
        where: {
          batch_id,
        },
      });
    } else {
      data = await this.cardsRepository.find({
        relations: ['batch', 'batch.point'],
        where: {
          id: In(ids),
        },
      });
    }
    // TODO: 导出表头

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
   */
  async queryAllCards(cardsPaginatedDto: CardsPaginatedDto) {
    let findWhere: any = {};

    const { search, pageSize, current } = cardsPaginatedDto;
    if (typeof search === 'string') {
      findWhere = [
        {
          serial: Like(`%${search}%`),
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
}
