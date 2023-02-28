import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum, ValidateIf } from 'class-validator';

/*  用户启用状态 */
export enum UserStatusEnum {
  YES = 1,
  NO = 0,
}

/* 用户角色枚举 */
export enum RoleEnum {
  ADMIN = 1,
  USER = 2,
}

export class CreateUserDto {
  @ApiProperty({
    description: '用户名(登录用)',
    example: 'test1@cuby',
  })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    description: '角色类型, 1: admin， 2: user',
    example: RoleEnum.USER,
    enum: RoleEnum,
  })
  @ValidateIf((value) => !!value.value)
  @IsEnum(RoleEnum)
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : RoleEnum.USER;
  })
  readonly role: RoleEnum;
}
