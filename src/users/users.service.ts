import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';
import { AppError } from '@/common/error/AppError';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';
import { Like, Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RoleEnum, UserStatusEnum } from './dto/create-user.dto';
import { UsersPaginatedDto } from './dto/users-pagination.dto';
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}
  onModuleInit() {
    this.createInitSuperUser();
  }

  /** 创建新用户 */
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const user = new UserEntity();
    Object.assign(user, createUserDto);

    const isExist = await this.findOneByUserName(user.username);
    if (isExist) {
      throw new AppError(AppErrorTypeEnum.USER_EXISTS);
    }
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
    await this.usersRepository.update(userId, user);
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
      where: findWhere,
      take: pageSize,
      skip: (current - 1) * pageSize,
      // order: {
      //   created_at: 'DESC',
      // },
    });

    return {
      results: data,
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
  queryUser(id: number): Promise<any> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateUserRole(id: number): Promise<any> {
    const userInfo = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userInfo) {
      throw new AppError(AppErrorTypeEnum.USER_NOT_FOUND);
    }

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
    await this.usersRepository.update(id, user);
  }

  async updateUserStatus(id: number): Promise<any> {
    const userInfo = await this.usersRepository.findOne({
      where: { id },
    });

    if (!userInfo) {
      throw new AppError(AppErrorTypeEnum.USER_NOT_FOUND);
    }

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
    await this.usersRepository.update(id, user);
  }

  async deleteUser(id: number): Promise<any> {
    const { affected } = await this.usersRepository.softDelete(id);
    if (affected <= 0) {
      throw new AppError(AppErrorTypeEnum.USER_NOT_FOUND);
    }
  }

  findOneByUserName(username: string): Promise<UserEntity> {
    return this.usersRepository.findOne({
      select: ['password_hash', 'username', 'id', 'status', 'role'],
      where: { username },
    });
  }
}