import { PickType } from '@nestjs/swagger';
import { CardEntity } from '../entities/card.entity';

export class QueryGroupIpDto extends PickType(CardEntity, ['ip'] as const) {}
