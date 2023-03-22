# Nest 的最佳实践

```md
- swagger
- logger
- ConfigModule
- TypeOrmModule
- JwtModule && PassportModule
- ServeStaticModule

- guard

  - local-auth.guard.ts
  - roles.guard.ts 角色权限控制

- pipe

  - BodyValidationPipe // 统一验证 DTO

- filter

  - HttpExceptionFilter // 拦截全部的错误请求,统一返回格式

- interceptor

  - TransformInterceptor // 统一请求成功的返回数据
  - LoggingInterceptor // 统一打上时间戳, 统计接口耗时

- decorators

  - api-obj-response.decorator.ts // swagger @ApiResponse <T>
  - api-list-response.decorator.ts
  - api-paginated-response.decorator.ts
  - user.decorator.ts
  - roles.decorator.ts

- middlewares

- error
```

## 环境依赖

- git
- node 16.19.1
- pnpm
- mysql5.7

## 安装

```bash
pnpm install
```

## 运行

```bash

# add .env in root before running

# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 集成测试

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 部署

```bash

# see deploy.sh
$ pm2 reload process-production.json --only card-mgr-service

```

## git 提交规范

```md
- feat - 新功能 feature
- fix - 修复 bug
- docs - 文档注释
- style - 代码格式(不影响代码运行的变动)
- refactor - 重构、优化(既不增加新功能，也不是修复 bug)
- perf - 性能优化
- test - 增加测试
- chore - 构建过程或辅助工具的变动
- revert - 回退
- build - 打包
```

## 开发

- 权限控制

  @Role 装饰器修饰, 默认不限制

  @Roles('ADMIN') only asset ADMIN

  @Roles('USER') only asset USER

  @Roles('USER', 'ADMIN') bath asset USER && ADMIN

```users.controller.ts
  @Post()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '创建用户' }) // 超级管理员才能创建用户
  @ApiObjResponse(UserEntity)
  CreateUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

```

- dto 继承

```md
PartialType 函数返回一个类型（类），并将所有输入类型设置为可选的
PickType 功能从一个输入类型中选择一部分属性来创建一个新类型（类）
OmitType()函数从一个输入类型中取出所有属性然后移除一些键。
IntersectionType()函数将两种类型组合成一个新类型（类）

可以组合使用
```

- [基于 Comlink 前端多线程下载实现]('https://github.com/hsycc/comlink-ts-demo/tree/main')

  参考 https://www.cnblogs.com/cangqinglang/p/15791367.html

## TODO

- [x] swagger apiResponse 支持多种结构
