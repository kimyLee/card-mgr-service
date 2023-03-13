import { PickType } from '@nestjs/swagger';
// import { CreatePointDto } from './create-point.dto';
import { PointEntity } from '../entities/point.entity';

export class UpdatePointDto extends PickType(PointEntity, [
  'point_path',
  'upload_status',
] as const) {}
