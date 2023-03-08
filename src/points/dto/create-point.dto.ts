import { ApiProperty, PickType } from '@nestjs/swagger';
import { Column } from 'typeorm';

import { PointEntity } from '@/points/entities/point.entity';

export enum QueryPointsPagingEnum {
  YES = '1',
  NO = '0',
}

export class CreatePointDto extends PickType(PointEntity, [
  'extent_min',
  'extent_max',
] as const) {
  @ApiProperty({
    description: '码点文件存放目录路径',
  })
  @Column({
    comment: '码点文件存放目录路径',
    nullable: true,
    default: () => null,
  })
  point_path?: string;
}
