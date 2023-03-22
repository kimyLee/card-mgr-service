import { OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class CurrentUserDto extends OmitType(UserEntity, [] as const) {}
