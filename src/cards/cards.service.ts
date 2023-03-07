import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { CardEntity } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AppError } from '@/common/error/AppError';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';
import { CardsPaginatedDto } from './dto/cards-pagination.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async createCard(createCardDto: CreateCardDto) {
    return await this.cardsRepository.save(createCardDto);
  }

  async updateCard(id: number, updateCardDto: UpdateCardDto) {
    return await this.cardsRepository.update(id, updateCardDto);
  }

  /**
   * @param cardsPaginatedDto: CardsPaginatedDto
   */
  async queryAllCards(cardsPaginatedDto: CardsPaginatedDto): Promise<any> {
    let findWhere: any = {};

    const { search, pageSize, current } = cardsPaginatedDto;
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
  queryCard(id: number): Promise<any> {
    return this.cardsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteCard(id: number): Promise<any> {
    const { affected } = await this.cardsRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.CARD_NOT_FOUND);
    }
  }
}
