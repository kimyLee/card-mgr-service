import { BatchEntity } from './../../batches/entities/batch.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import BaseEntity from '@/common/entities/baseEntity';

@Entity({ name: 'cards' })
export class CardEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty()
  @Column({
    comment: '卡牌编号',
  })
  public serial: string;

  @ApiProperty()
  @Column({
    comment: '卡牌名',
  })
  public name: string;

  @ApiProperty()
  @Column({
    comment: 'ip',
  })
  public ip: string;

  @ApiProperty()
  @Column({
    comment: '系列',
  })
  public series: string;

  @ApiProperty()
  @Column({
    comment: '弹数',
  })
  public amount: string;

  @ApiProperty()
  @Column({
    comment: '码点链接',
  })
  public point_url: number;

  @ManyToOne(() => BatchEntity, (batch) => batch)
  @JoinColumn({
    name: 'batch_id',
  })
  batch: BatchEntity;
}
