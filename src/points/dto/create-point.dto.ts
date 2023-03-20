import { ApiProperty, PickType } from '@nestjs/swagger';

import { PointEntity } from '@/points/entities/point.entity';

export class CreatePointDto extends PickType(PointEntity, [
  'extent_min',
  'extent_max',
] as const) {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
