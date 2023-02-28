/*
 * 定制基本Entity的形状
 * 包含 `createdAt`, `updatedAt`, `deleteAt` 用于记录时间戳的东西
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-02-28 04:41:24
 * @Description:
 *
 */

import { ApiProperty } from '@nestjs/swagger';
import 'reflect-metadata';
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  BeforeRemove,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseEntity {
  @ApiProperty({
    description: '创建时间',
    type: 'timestamp',
  })
  // @CreateDateColumn({ type: 'datetime', select: false })  #sqlite
  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    type: 'timestamp',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    // select: false,
    nullable: true,
    default: () => null,
  })
  public updatedAt?: Date;

  @ApiProperty({
    description: '删除时间',
    type: 'timestamp',
  })
  @DeleteDateColumn({
    select: false,
    nullable: true,
    default: () => null,
  })
  public deletedAt?: Date;

  @BeforeInsert()
  updateDateCreation(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateDateUpdate(): void {
    this.updatedAt = new Date();
  }

  @BeforeRemove()
  updateDeleteAt(): void {
    this.deletedAt = new Date();
  }
}
