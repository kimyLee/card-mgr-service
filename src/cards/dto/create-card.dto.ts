import { CardEntity } from './../entities/card.entity';
import { PickType } from '@nestjs/swagger';

export class CreateCardDto extends PickType(CardEntity, [
  'serial',
  'name',
  'type',
  'batch',
  'point',
] as const) {
  ip?: string;
  series?: string;
  amount?: string;
  point_url?: string;
  remark?: string;
}
