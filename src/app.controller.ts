/*
 * @Author: hsycc
 * @Date: 2023-02-21 11:07:06
 * @LastEditTime: 2023-02-21 11:58:49
 * @Description:
 *
 */
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
