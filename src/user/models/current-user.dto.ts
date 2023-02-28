import { RoleEnum } from './create-user.dto';

export class CurrentUserDto {
  readonly id?: number;
  readonly role?: RoleEnum;
  readonly status?: number;
  readonly username?: string;
  readonly avatar?: string;
  readonly createdAt?: number | string;
  readonly updatedAt?: number | string;
}
