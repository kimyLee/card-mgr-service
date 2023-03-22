/*
 * 使用方法:
 *  import { RolesGuard } from '@/common/guards/admin.guard';
 *  @UseGuards(RolesGuard)
 *  @SetMetadata('needOwner', boolean)
 *
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-03-22 04:54:31
 * @Description:
 *
 */

import { RoleEnum } from '@/users/types/users.type';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 获取用户信息, 更可以进行权限拦截(如果用户不是超级管理员)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const active = roles.some((role: string) => RoleEnum[role] === user.role);

    return active;
  }
}
