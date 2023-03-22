import { CardEntity } from './../entities/card.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateCardDto extends PickType(CardEntity, [
  'case_no',
  'card_name',
  'type',
  'point_value',
] as const) {
  @ApiProperty({
    description: 'ip',
    example: '火影ip',
  })
  ip?: string;

  @ApiProperty({
    description: '系列',
    example: '火影系列',
  })
  series?: string;

  @ApiProperty({
    description: '弹数',
    example: '弹数50',
  })
  amount?: string;

  @ApiProperty({
    description: '码点链接',
  })
  point_url?: string;

  @ApiProperty({
    description: '原始码点链接',
  })
  original_point_url?: string;

  @ApiProperty({
    description: '备注',
    example: '备注',
  })
  remark?: string;

  @ApiProperty({
    description: '批次ID',
  })
  batch_id: number;
}
