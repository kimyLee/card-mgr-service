import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

import { CardEntity } from './entities/card.entity';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsPaginatedDto } from './dto/cards-pagination.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async createCard(createCardDto: CreateCardDto) {
    const card = new CardEntity();
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
