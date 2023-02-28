/*
 * @Author: hsycc
 * @Date: 2023-02-21 11:07:06
 * @LastEditTime: 2023-02-21 15:25:37
 * @Description:
 *
 */

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('app_info')
  @ApiOperation({ summary: '获取Application调试信息(非生产环境可用)' })
  app_info(): string {
    return process.env.NODE_ENV !== 'production'
      ? this.appService.getDebugInfo()
      : '';
  }
}
