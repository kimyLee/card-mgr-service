import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import {
  ResPaginatedDto,
  ResponseDto,
  ResponseListDto,
  ResponseObjDto,
  ResponsePaginatedDto,
} from '@/common/dto/response.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';

import { BatchesService } from './batches.service';
import { BatchEntity } from './entities/batch.entity';

import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { BatchesPaginatedDto } from './dto/batches-pagination.dto';

@Controller('api/batches')
@ApiTags('batches')
@ApiExtraModels(
  BatchEntity,
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
)
export class BatchesController {
  constructor(
    @Inject(forwardRef(() => BatchesService))
    private readonly batchesService: BatchesService,
  ) {}

  @Post()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'BETA: 创建空批次' })
  @ApiObjResponse(BatchEntity)
  CreateBatch(@Body() createBatchDto: CreateBatchDto) {
    return this.batchesService.createBatch(createBatchDto);
  }

  @Patch(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '更新批次' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  UpdateBatch(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.updateBatch(+id, updateBatchDto);
  }

  @Get()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '分页获取批次列表' })
  @ApiPaginatedResponse(BatchEntity)
  QueryAllCards(@Query() batchesPaginatedDto: BatchesPaginatedDto) {
    return this.batchesService.queryAllBatches(batchesPaginatedDto);
  }

  @Get('get_batches_group')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 批次 group' })
  @ApiPaginatedResponse(BatchEntity)
  QueryGroupBatches() {
    return this.batchesService.queryGroupBatches();
  }

  @Get(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取单个批次信息' })
  @ApiObjResponse(BatchEntity)
  QueryCard(@Param('id') id: string) {
    return this.batchesService.queryBatch(+id);
  }
}
