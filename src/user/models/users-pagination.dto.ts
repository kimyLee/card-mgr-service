import { PaginatedDto } from '@/common/models/pagination.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UsersPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索用户名/用户id',
    example: '',
  })
  public search?: string;

  //   public sortBy?: string[];
}
