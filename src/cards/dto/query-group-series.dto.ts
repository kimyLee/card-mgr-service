import { PickType } from '@nestjs/swagger';
import { CardEntity } from '../entities/card.entity';

export class QueryGroupSeriesDto extends PickType(CardEntity, [
  'series',
] as const) {}
