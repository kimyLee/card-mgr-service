import { ApiProperty, PickType } from '@nestjs/swagger';
import { BatchEntity } from '@/batches/entities/batch.entity';
import { PointEntity } from '@/points/entities/point.entity';
export class CreateBatchDto extends PickType(BatchEntity, [
  'batch_name',
  'count',
  'new_count',
  'reprint_count',
] as const) {
  @ApiProperty({
    example: '备注',
  })
  remake?: string;

  @ApiProperty({
    description: '码点库id',
  })
  point_id: PointEntity['id'];
}
