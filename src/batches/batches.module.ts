import { PointsModule } from '@/points/points.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { BatchEntity } from './entities/batch.entity';

@Module({
  imports: [
    forwardRef(() => PointsModule),
    TypeOrmModule.forFeature([BatchEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
