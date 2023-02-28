import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginatedDto {
  @ApiProperty({
    description: '分页长度',
    example: 20,
  })
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 50;
  })
  @IsNumber()
  public pageSize = 20;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 1;
  })
  @IsNumber()
  public current = 1;
}
