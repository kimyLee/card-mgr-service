import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardEntity } from './entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
