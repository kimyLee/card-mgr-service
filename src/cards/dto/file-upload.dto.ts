import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({
    description: '码点id',
  })
  point_id: number;

  @ApiProperty({
    description: '新的批次名',
  })
  batch_name: string;
}
