import BaseEntity from '@/common/entities/baseEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    nullable: true,
    default: () => null,
  })
  point_path: string;

  @ApiProperty({
    description: '后台上传状态',
  })
  @Column({
    comment: '后台上传状态',
    default: () => 0,
  })
  upload_status: number;

  @ApiProperty({
    description: '码点区间下限',
  })
  @Column({
    comment: '码点区间下限',
  })
  extent_min: number;

  @ApiProperty({
    description: '码点区间上限',
  })
  @Column({
    comment: '码点区间上限',
  })
  extent_max: number;
}
