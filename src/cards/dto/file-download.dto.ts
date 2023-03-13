import { ApiProperty } from '@nestjs/swagger';

export class FileDownloadDto {
  @ApiProperty({
    description: 'card ids',
    example: null,
  })
  ids?: number[];

  @ApiProperty({
    description: '批次id, 二入1',
    example: 1,
  })
  batch_id?: number;
}
