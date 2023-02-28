import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthDto {
  @ApiProperty({
    description: '用户名',
    example: 'test@cuby',
  })
  readonly username: string;
  @ApiProperty({
    description: '密码',
    example: 'cuby123456',
  })
  readonly password: string;
}
