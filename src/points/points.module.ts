import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { PointEntity } from './entities/point.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([PointEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
