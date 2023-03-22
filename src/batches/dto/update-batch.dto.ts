import { PickType } from '@nestjs/swagger';
import { CreateBatchDto } from './create-batch.dto';

export class UpdateBatchDto extends PickType(CreateBatchDto, [
  'batch_name',
] as const) {}
