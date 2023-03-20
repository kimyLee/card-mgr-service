import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginatedDto } from '@/common/dto/pagination.dto';
import { Transform } from 'class-transformer';
export class CardsPaginatedDto extends PartialType(PaginatedDto) {
  @ApiProperty({
    description: '模糊搜索卡牌编号/卡牌名',
    example: '',
    default: '',
  })
  public search?: string;

  @ApiProperty({
    description: 'ip',
    example: '',
    default: '',
  })
  public ip?: string;

  @ApiProperty({
    description: 'series',
    example: '',
    default: '',
  })
  public series?: string;

  @ApiProperty({
    description: 'batch_id',
    example: null,
    default: null,
    type: Number,
  })
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : null;
  })
  public batch_id?: number;

  //   public sortBy?: string[];
}
