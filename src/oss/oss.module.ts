import { Global, Module } from '@nestjs/common';
import { OssService } from './oss.service';

@Global()
@Module({
  controllers: [],
  providers: [OssService],
  exports: [OssService],
})
export class OssModule {
  constructor(private readonly ossService: OssService) {}
}
