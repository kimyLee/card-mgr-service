/*
 * 定制基本Entity的形状
 * 包含 `created_at`, `updated_at`, `deleteAt` 用于记录时间戳的东西
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-03-06 08:18:45
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
    type: Date,
  })
  // @CreateDateColumn({ type: 'datetime', select: false })  #sqlite
  @CreateDateColumn({ type: 'timestamp' })
  public created_at: Date;

  @ApiProperty({
    description: '更新时间',
    type: Date,
  })
  @UpdateDateColumn({
    type: 'timestamp',
    // select: false,
    nullable: true,
    default: () => null,
  })
  public updated_at?: Date;

  @ApiProperty({
    description: '删除时间',
    type: Date,
  })
  @DeleteDateColumn({
    select: false,
    nullable: true,
    default: () => null,
  })
  public deleted_at?: Date;

  @BeforeInsert()
  updateDateCreation(): void {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  updateDateUpdate(): void {
    this.updated_at = new Date();
  }

  @BeforeRemove()
  updateDeleteAt(): void {
    this.deleted_at = new Date();
  }
}
