import { AppError } from './../common/error/AppError';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CurrentUser } from '@/common/decorators/user.decorator';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './models/create-user.dto';
import { UpdatePasswordDto } from './models/update-password.dto';
import { UsersPaginatedDto } from './models/users-pagination.dto';
import { AppErrorTypeEnum } from '@/common/error/AppErrorTypeMap';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/current')
  @UseGuards(AuthGuard())
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '获取当前用户信息' })
  QueryCurrentUser(@CurrentUser() userId: number): Promise<any> {
    return this.usersService.queryUser(userId);
  }

  @Post()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '创建用户' }) // 超级管理员才能创建用户
  CreateUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('/list')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取用户列表' })
  QueryAllUsers(@Query() usersPaginatedDto: UsersPaginatedDto): Promise<any> {
    return this.usersService.queryAllUsers(usersPaginatedDto);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '查找用户' })
  QueryUser(@Param('id') id: number): Promise<any> {
    return this.usersService.queryUser(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '修改用户' })
  DeleteUser(
    @Param('id') id: number,
    @CurrentUser() userId: number,
  ): Promise<any> {
    if (id === 1) {
      throw new AppError(AppErrorTypeEnum.NOT_MODIFY_SUP);
    }
    if (userId === id) {
      throw new AppError(AppErrorTypeEnum.NOT_MODIFY_SUP);
    }
    return this.usersService.deleteUser(id);
  }

  @Put('/role/:id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '修改用户角色' })
  UpdateUserRole(@Param('id') id: number): Promise<any> {
    if (id === 1) {
      throw new AppError(AppErrorTypeEnum.NOT_MODIFY_SUP);
    }
    return this.usersService.updateUserRole(id);
  }

  @Put('/update_password')
  @UseGuards(AuthGuard())
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '更新用户密码' })
  UpdatePassword(
    @CurrentUser() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }

  @Put('/enable/:id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '启用/停用用户' })
  UpdateUserStatus(@Param('id') id: number): Promise<any> {
    if (id === 1) {
      throw new AppError(AppErrorTypeEnum.NOT_MODIFY_SUP);
    }
    return this.usersService.updateUserStatus(id);
  }
}
