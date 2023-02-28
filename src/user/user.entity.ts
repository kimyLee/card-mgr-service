import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as crypto from 'crypto';
import BaseEntity from '@/baseEntity';
import { RoleEnum, UserStatusEnum } from './models/create-user.dto';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    length: 50,
    unique: true,
  })
  public username: string;

  @Column({
    comment: '头像',
    default: '',
  })
  public avatar: string;

  @Column({
    comment: '状态, 1: enable, 0: disable',
    default: UserStatusEnum.YES,
  })
  public status: number;

  @Column({
    comment: '角色, 1: admin, 2: user',
    default: RoleEnum.USER,
  })
  public role: number;

  @Column({
    length: 250,
    // do not return this column when using find methods or running a query to select a user.
    select: false,
    // set the actual column name
    name: 'password',
  })
  @ApiHideProperty()
  public password_hash: string;

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
