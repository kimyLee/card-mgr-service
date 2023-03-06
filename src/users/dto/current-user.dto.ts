import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CurrentUserDto extends OmitType(UserEntity, [] as const) {}

// PartialType 函数返回一个类型（类），并将所有输入类型设置为可选的
// PickType 功能从一个输入类型中选择一部分属性来创建一个新类型（类）
// OmitType()函数从一个输入类型中取出所有属性然后移除一些键。
// IntersectionType()函数将两种类型组合成一个新类型（类）
