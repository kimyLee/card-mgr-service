import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { PointsModule } from '@/points/points.module';
import { BatchesModule } from '@/batches/batches.module';

import { CardEntity } from './entities/card.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PointsModule,
    BatchesModule,
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
