import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateIf,
  IsUrl,
} from 'class-validator';
import { RoleEnum } from '../types/users.type';

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

  @ApiProperty({
    description: '头像url',
    example: '',
    default: '',
  })
  @ValidateIf((value) => !!value.avatar)
  @IsUrl()
  readonly avatar?: string;
}
