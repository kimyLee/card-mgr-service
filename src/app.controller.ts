/*
 * @Author: hsycc
 * @Date: 2023-02-21 11:07:06
 * @LastEditTime: 2023-03-06 07:45:01
 * @Description:
 *
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResponseDto } from './common/dto/response.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('app_info')
  @ApiOperation({ summary: '获取Application调试信息(非生产环境可用)' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  app_info(): string {
    return process.env.NODE_ENV !== 'production'
      ? this.appService.getDebugInfo()
      : '';
  }
}
