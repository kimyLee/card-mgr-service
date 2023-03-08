import { ApiProperty, PartialType } from '@nestjs/swagger';

import { PaginatedDto } from '@/common/dto/pagination.dto';
export class BatchesPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索批次名',
    example: '',
  })
  public search?: string;

  //   public sortBy?: string[];
}
