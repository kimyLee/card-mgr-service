/*
 * @Author: hsycc
 * @Date: 2023-02-21 11:07:06
 * @LastEditTime: 2023-03-22 15:03:47
 * @Description:
 *
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';

import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import appConfig from './config';
import loggerOptions from './common/logger';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { BatchesModule } from './batches/batches.module';
import { CardsModule } from './cards/cards.module';
import { PointsModule } from './points/points.module';

import { OssModule } from './oss/oss.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    /*  配置模块 */
    ConfigModule.forRoot({
      load: appConfig,
      isGlobal: true,
    }),
    /* ORM, TypeORM */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: config.get<'mysql'>('database.type'),
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.database'),
          charset: config.get<string>('database.charset'),
          multipleStatements: config.get<boolean>(
            'database.multipleStatements',
          ),
          connectionLimit: 10, // 连接限制
          /* with that options, every model registered through the `forFeature()` method will be automatically added to the `models` arrays of the configuration object */
          autoLoadEntities: true,
          logging: config.get<LoggerOptions>('database.logging'),
          logger: config.get<any>('database.logger'),
          synchronize: config.get<boolean>('database.synchronize'),
          dropSchema: config.get<boolean>('database.dropSchema'),
          cache: config.get<boolean>('database.cache'),
        };
      },
    }),
    /* 日志, Winston */
    WinstonModule.forRoot(loggerOptions),

    /* 静态资源目录 */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    OssModule,
    AuthModule,
    UsersModule,
    PointsModule,
    BatchesModule,
    CardsModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
