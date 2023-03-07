import { PaginatedDto } from '@/common/dto/pagination.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class BatchesPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索用户id',
    example: '',
  })
  public search?: string;

  //   public sortBy?: string[];
}
