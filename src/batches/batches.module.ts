import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { BatchEntity } from './entities/batch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
