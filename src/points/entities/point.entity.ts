import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import BaseEntity from '@/common/entities/baseEntity';
import { PointUploadStatus } from '../types/point.type';

@Entity({ name: 'points' })
export class PointEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '码点文件存放目录路径',
  })
  @Column({
    comment: '码点文件存放目录路径',
  })
  point_path: string;

  @ApiProperty({
    description: '码点库上传 oss 的文件数量',
  })
  @Column({
    comment: '码点库上传 oss 的总文件数量',
  })
  upload_count: number;

  @ApiProperty({
    description: '对应码点库上传 oss 的总文件数量',
  })
  @Column({
    comment: '对应码点库 已经分配给批次卡牌的数量',
    default: 0,
  })
  use_count: number;

  @ApiProperty({
    description: '后台上传状态',
    default: PointUploadStatus.AWAIT,
  })
  @Column({
    comment: '上传状态',
    nullable: true,
    default: PointUploadStatus.AWAIT,
    type: 'int',
  })
  upload_status: PointUploadStatus;

  @ApiProperty({
    description: '码点区间下限',
    example: 600,
  })
  @Column({
    comment: '码点区间下限',
  })
  extent_min: number;

  @ApiProperty({
    description: '码点区间上限',
    example: 1000,
  })
  @Column({
    comment: '码点区间上限',
  })
  extent_max: number;
}
