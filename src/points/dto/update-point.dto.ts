import { PickType, PartialType } from '@nestjs/swagger';
import { PointEntity } from '../entities/point.entity';

export class UpdatePointDto extends PartialType(
  PickType(PointEntity, ['upload_status', 'use_count'] as const),
) {}
