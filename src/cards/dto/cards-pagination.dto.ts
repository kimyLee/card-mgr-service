import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginatedDto } from '@/common/dto/pagination.dto';
export class CardsPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索卡牌编号',
    example: '',
  })
  public search?: string;

  //   public sortBy?: string[];
}
