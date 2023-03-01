import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { Like, Repository } from 'typeorm';

import { CreateUserDto } from './models/create-user.dto';
import { UserEntity } from './user.entity';
import { UpdatePasswordDto } from './models/update-password.dto';

import { RoleEnum, UserStatusEnum } from './models/create-user.dto';
import { UsersPaginatedDto } from './models/users-pagination.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {
    this.createInitSuperUser();
  }

  /** 创建新用户 */
  createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = new UserEntity();
    Object.assign(user, createUserDto);
    return this.usersRepository.save(user);
  }

  /** 创建初始超级管理用户 */
  async createInitSuperUser(): Promise<any> {
    const username = this.configService.get<string>(
      'accountConfig.superAccountName',
    );
    const password = this.configService.get<string>(
      'accountConfig.superAccountPass',
    );
    const user = await this.findOneByUserName(username);
    if (!user) {
      const user = new UserEntity();
      Object.assign(user, {
        username,
        password,
        role: RoleEnum.ADMIN,
        id: 1,
      });
      return this.usersRepository.save(user);
    }
  }

  /** 更新用户的密码 */
  async updatePassword(
    userId: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const userInfo = await this.usersRepository.findOne({
      where: { id: userId },
    });
    const user = new UserEntity();
    Object.assign(user, userInfo, updatePasswordDto);
    const { affected } = await this.usersRepository.update(userId, user);
    if (affected > 0)
      return this.usersRepository.findOne({
        where: { id: userId },
      });
  }

  /**
   * @param usersPaginatedDto UsersPaginatedDto
   */
  async queryAllUsers(usersPaginatedDto: UsersPaginatedDto): Promise<any> {
    let findWhere: any = {};

    const { search, pageSize, current } = usersPaginatedDto;
    if (typeof search === 'string') {
      findWhere = [
        {
          id: Like(`%${search}%`),
          ...findWhere,
        },
        // or..
        {
          username: Like(`%${search}%`),
          ...findWhere,
        },
      ];
    }

    const [data, total] = await this.usersRepository.findAndCount({
      select: ['id', 'username', 'role', 'status', 'createdAt', 'updatedAt'],
      where: findWhere,
      take: pageSize,
      skip: (current - 1) * pageSize,
      // order: {
      //   createdAt: 'DESC',
      // },
    });

    return {
      list: data,
      pagination: {
        current,
        pageSize,
        total: total,
      },
    };
  }

  /**
   *
   * @param id 用户的ID
   */
  queryUser(id: number): Promise<UserEntity> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  findOneByUserName(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      select: ['password_hash', 'username', 'id', 'status', 'role'],
      where: { username },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async updateUserRole(id: number): Promise<UserEntity> {
    const userInfo = await this.usersRepository.findOne({
      where: { id },
    });
    switch (userInfo.role) {
      case RoleEnum.USER:
        userInfo.role = RoleEnum.ADMIN;
        break;
      default:
        userInfo.role = RoleEnum.USER;
        break;
    }
    const user = new UserEntity();
    Object.assign(user, userInfo);
    const { affected } = await this.usersRepository.update(id, user);
    if (affected > 0)
      return this.usersRepository.findOne({
        where: { id },
      });
  }

  async updateUserStatus(id: number): Promise<UserEntity> {
    const userInfo = await this.usersRepository.findOne({
      where: { id },
    });
    switch (userInfo.status) {
      case UserStatusEnum.YES:
        userInfo.status = UserStatusEnum.NO;
        break;
      default:
        userInfo.status = UserStatusEnum.YES;
        break;
    }
    const user = new UserEntity();
    Object.assign(user, userInfo);
    const { affected } = await this.usersRepository.update(id, user);
    if (affected > 0)
      return this.usersRepository.findOne({
        where: { id },
      });
  }
}
