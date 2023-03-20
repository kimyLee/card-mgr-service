import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginatedDto } from '@/common/dto/pagination.dto';
import { QueryPointsPagingEnum } from '../types/point.type';
export class PointsPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索',
    example: '',
  })
  public search?: string;

  @ApiProperty({
    description: '是否分页',
    example: QueryPointsPagingEnum.NO,
    default: QueryPointsPagingEnum.YES,
  })
  public paging?: QueryPointsPagingEnum;

  //   public sortBy?: string[];
}
