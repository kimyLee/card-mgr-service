/*
 * @Author: hsycc
 * @Date: 2023-02-21 11:07:06
 * @LastEditTime: 2023-03-09 20:33:54
 * @Description:
 *
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { HttpExceptionFilter } from './common/filters/HttpExceptionFilter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppModule } from './app.module';
import loggerOptions from './common/logger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { BodyValidationPipe } from './common/pipes/body-validation.pipe';

import { join } from 'path';

/** 服务启动的端口 */
const port = process.env.PORT || 3000;
/** Winston Logger */
const logger = WinstonModule.createLogger(loggerOptions);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // https://github.com/gremo/nest-winston#use-as-the-main-nest-logger-also-for-bootstrapping
    logger,
  });
  /* 设置 `Winston.logger` 日志为Nest的日志, 这样才能打印出系统初始化时的日志 */
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  /* 将Nestjs作为静态资源 */
  app.useStaticAssets(
    join(
      __dirname,
      process.env.NODE_ENV === 'production' ? './' : '../',
      'public',
    ),
  );

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('card-mgr-service')
    .setDescription('卡牌管理后台')
    .setVersion('1.0.0')
    // .addServer('http://')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
    .build();
  const options: SwaggerDocumentOptions = {
    // 去掉 moduleController 前缀
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      // 刷新页面后保留身份验证令牌
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  /* 设置接口请求频率 */
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );
  /* 网络安全 - Web漏洞 */
  app.use(helmet());

  /* 统一验证DTO */
  app.useGlobalPipes(new BodyValidationPipe());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  /* 统一请求成功的返回数据 */
  app.useGlobalInterceptors(new TransformInterceptor());
  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  /* 拦截全部的错误请求,统一返回格式 */
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  /* 允许跨域, 减少麻烦 */
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  logger.log(`process.env.NODE_ENV:${process.env.NODE_ENV}`, bootstrap.name);
  await app.listen(port);
  logger.log(`http://localhost:${port} 服务启动成功`, bootstrap.name);
}
bootstrap();
