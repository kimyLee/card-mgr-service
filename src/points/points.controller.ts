import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
} from '@/common/dto/response.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';

import { PointsService } from './points.service';
import { PointEntity } from './entities/point.entity';

import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PointsPaginatedDto } from './dto/points-pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/points')
@ApiTags('points')
@ApiExtraModels(
  PointEntity,
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '创建码点区域' })
  @ApiObjResponse(PointEntity)
  createPoint(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPointDto: CreatePointDto,
  ) {
    return this.pointsService.createPoint(createPointDto, file);
  }

  @Patch(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '更新码点区域' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  updatePoint(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.updatePoint(+id, updatePointDto);
  }

  @Get()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取码点列表' })
  @ApiPaginatedResponse(PointEntity)
  QueryAllCards(@Query() pointsPaginatedDto: PointsPaginatedDto) {
    return this.pointsService.queryAllPoints(pointsPaginatedDto);
  }

  @Get(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取码点信息' })
  @ApiObjResponse(PointEntity)
  QueryCard(@Param('id') id: string) {
    return this.pointsService.queryPoint(+id);
  }

  @Delete(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({
    summary: '软删除, 关联了批次的码点库需要删除对应关联的批次才能删除',
  })
  @ApiOkResponse({
    type: ResponseDto,
  })
  DeletePoint(@Param('id') id: string) {
    return this.pointsService.deletePoint(+id);
  }
}
