import { Controller, Get } from '@nestjs/common';

import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseDto } from '@/common/dto/response.dto';
import { OssService } from './oss.service';
@Controller('api/oss')
// @ApiTags('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('oss_test')
  @ApiOperation({ summary: 'ali-oss 测试接口(非生产环境可用)' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  OssTest() {
    return process.env.NODE_ENV !== 'production' ? this.ossService.test() : '';
  }
}
