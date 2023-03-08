import { PickType } from '@nestjs/swagger';
import { BatchEntity } from '@/batches/entities/batch.entity';
export class CreateBatchDto extends PickType(BatchEntity, [
  'batch_name',
  'count',
  'new_count',
  'reprint_count',
  'point',
] as const) {
  remake?: string;
}
