import { ApiProperty } from '@nestjs/swagger';

export class FileDownloadDto {
  @ApiProperty({
    description: '批次id',
    example: 1,
  })
  batch_id?: number;
}
