import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';
import BaseEntity from '@/common/entities/baseEntity';
import { RoleEnum, UserStatusEnum } from '../dto/create-user.dto';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({
    description: '自增id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '用户名,不可重复',
  })
  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @ApiProperty({
    description: '头像',
  })
  @Column({
    comment: '头像',
    default: '',
  })
  avatar: string;

  @Column({
    comment: '状态, 1: enable, 0: disable',
    default: UserStatusEnum.YES,
    type: 'int',
  })
  @ApiProperty({
    description: '账号启用状态, 1: enable, 0: disable',
  })
  status: UserStatusEnum;

  @ApiProperty({
    description: '角色类型, 1: admin， 2: user',
  })
  @Column({
    comment: '角色, 1: admin, 2: user',
    default: RoleEnum.USER,
    type: 'int',
  })
  role: RoleEnum;

  @Column({
    length: 250,
    // do not return this column when using find methods or running a query to select a user.
    select: false,
    // set the actual column name
    name: 'password',
  })
  @ApiHideProperty()
  @Exclude()
  password_hash: string;

  /**
   * TypeScript setter to automatically hash the password when the password property is set.
   */
  set password(password: string) {
    const passHash = crypto.createHmac('sha256', password).digest('hex');
    this.password_hash = passHash;
  }

  // @OneToMany(

  // )
}
