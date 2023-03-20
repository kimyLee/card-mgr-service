import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import BaseEntity from '@/common/entities/baseEntity';

import { BatchEntity } from '@/batches/entities/batch.entity';
import { CardTypeEnum } from '../types/cards.type';

@Entity({ name: 'cards' })
export class CardEntity extends BaseEntity {
  @ApiProperty({
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '卡牌编号',
    example: 'NR-PR-042',
  })
  @Column({
    comment: '卡牌编号',
  })
  case_no: string;

  @ApiProperty({
    description: '卡牌名',
    example: '火影xxxxx卡牌',
  })
  @Column({
    comment: '卡牌名',
  })
  card_name: string;

  @ApiProperty({
    description: '码点值',
    example: 100535526,
  })
  @Column({
    comment: '码点值',
  })
  point_value: number;

  @ApiProperty({
    description: 'ip',
  })
  @Column({
    comment: 'ip',
    nullable: true,
  })
  ip: string;

  @ApiProperty({
    description: '系列',
  })
  @Column({
    comment: '系列',
    nullable: true,
  })
  series: string;

  @ApiProperty({
    description: '弹数',
  })
  @Column({
    comment: '弹数',
    nullable: true,
  })
  amount: string;

  @ApiProperty({
    description: '码点链接',
  })
  @Column({
    comment: '码点链接',
    nullable: true,
  })
  point_url: string;

  @ApiProperty({
    description: '类型  1: 新增 ; 2: 复刻',
    example: 1,
  })
  @Column({
    comment: '类型  1: 新增 ; 2: 复刻',
    default: 1,
  })
  type: CardTypeEnum;

  @ApiProperty({
    description: '备注',
  })
  @Column({
    comment: '备注',
    nullable: true,
  })
  remark: string;

  @Column()
  batch_id: number;

  @ManyToOne(() => BatchEntity, (batch) => batch)
  @JoinColumn({
    name: 'batch_id',
  })
  batch: BatchEntity;
}
