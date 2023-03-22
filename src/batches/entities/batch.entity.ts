import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import BaseEntity from '@/common/entities/baseEntity';
import { PointEntity } from '@/points/entities/point.entity';

@Entity({ name: 'batches' })
export class BatchEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '批次名',
    example: '第一批录入',
  })
  @Column({
    comment: '批次名',
  })
  batch_name: string;

  @ApiProperty({
    description: '卡牌数',
    example: 56,
  })
  @Column({
    comment: '卡牌数',
  })
  count: number;

  @ApiProperty({
    description: '新增卡牌数',
    example: 55,
  })
  @Column({
    comment: '新增卡牌数',
  })
  new_count: number;

  @ApiProperty({
    description: '复刻卡牌数',
    example: 1,
  })
  @Column({
    comment: '复刻卡牌数',
  })
  reprint_count: number;

  @ApiProperty({
    description: '备注',
    example: '备注',
  })
  @Column({
    comment: '备注',
    nullable: true,
  })
  remake: string;

  @Column()
  point_id: number;

  @ManyToOne(() => PointEntity, (point) => point)
  @JoinColumn({
    name: 'point_id',
  })
  point: PointEntity;
}
