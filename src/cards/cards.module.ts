import { PointEntity } from '@/points/entities/point.entity';
import { BatchEntity } from '@/batches/entities/batch.entity';
import { BatchesService } from './../batches/batches.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardEntity } from './entities/card.entity';
import { PointsService } from '@/points/points.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity, BatchEntity, PointEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CardsController],
  providers: [CardsService, BatchesService, PointsService],
  exports: [CardsService],
})
export class CardsModule {}
