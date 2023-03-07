import { PointEntity } from './../../points/entities/point.entity';
import BaseEntity from '@/common/entities/baseEntity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'batches' })
export class BatchEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '批次名',
  })
  @Column({
    comment: '批次名',
  })
  batch_name: string;

  @ApiProperty({
    description: '卡牌数',
  })
  @Column({
    comment: '卡牌数',
  })
  count: number;

  @ApiProperty({
    description: '新增卡牌数',
  })
  @Column({
    comment: '新增卡牌数',
  })
  new_count: number;

  @ApiProperty({
    description: '复刻卡牌数',
  })
  @Column({
    comment: '复刻卡牌数',
  })
  reprint_count: number;

  @ApiProperty({
    description: '备注',
  })
  @Column({
    comment: '备注',
  })
  remake: string;

  @ManyToOne(() => PointEntity)
  @JoinColumn({
    name: 'point_id',
  })
  point: PointEntity;
}
