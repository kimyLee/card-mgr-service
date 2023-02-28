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
import { ApiTags, ApiOperation, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './models/create-user.dto';
import { UpdatePasswordDto } from './models/update-password.dto';

import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { PaginatedDto } from '@/common/models/pagination.dto';
import { CurrentUser } from '@/common/decorators/user.decorator';

@Controller('api/user')
@ApiTags('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('/current')
  @UseGuards(AuthGuard())
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '获取当前账号信息' })
  QueryCurrentUser(@CurrentUser() userId: number): Promise<UserEntity> {
    return this.usersService.queryUser(userId);
  }

  @Post()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '创建账号' }) // 超级管理员才能创建账号
  CreateUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取账号列表' })
  @ApiQuery({
    required: false,
    name: 'search',
  })
  @ApiQuery({
    required: false,
    name: 'search1',
  })
  QueryAllUsers(
    @Query() pagination: PaginatedDto,
    // @Query() search?: string,
  ): Promise<UserEntity[]> {
    return this.usersService.queryAllUsers(pagination, '');
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '查找账号' })
  QueryUser(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.queryUser(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '修改账号' })
  DeleteUser(
    @Param('id') id: number,
    @CurrentUser() userId: number,
  ): Promise<any> {
    if (id === 1) {
      throw new Error('不能删除初始超管账号');
    }
    if (userId === id) {
      throw new Error('不能删除当前登录的账号');
    }
    return this.usersService.deleteUser(id);
  }

  @Put('/role/:id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '删除账号' })
  UpdateUserRole(@Param('id') id: number): Promise<any> {
    if (id === 1) {
      throw new Error('不能修改初始超管账号的角色权限');
    }
    return this.usersService.updateUserRole(id);
  }

  @Put('/update_password')
  @UseGuards(AuthGuard())
  @ApiSecurity('bearer')
  @ApiOperation({ summary: '更新账号密码' })
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
  @ApiOperation({ summary: '启用/停用账号' })
  UpdateUserStatus(@Param('id') id: number): Promise<any> {
    if (id === 1) {
      throw new Error('不能修改初始超管账号的状态');
    }
    return this.usersService.updateUserStatus(id);
  }
}
