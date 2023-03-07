import { PaginatedDto } from '@/common/dto/pagination.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PointsPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索 id',
    example: '',
  })
  public search?: string;

  //   public sortBy?: string[];
}
