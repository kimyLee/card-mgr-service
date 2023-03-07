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
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import {
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
} from '@/common/dto/response.dto';

import { PointsService } from './points.service';

import { PointEntity } from './entities/point.entity';

import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { PointsPaginatedDto } from './dto/points-pagination.dto';

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
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '创建码点区域' })
  @ApiObjResponse(PointEntity)
  createPoint(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.createPoint(createPointDto);
  }

  @Patch(':id')
  @Roles('ADMIN')
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
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取码点列表' })
  @ApiPaginatedResponse(PointEntity)
  QueryAllCards(@Query() pointsPaginatedDto: PointsPaginatedDto) {
    return this.pointsService.queryAllPoints(pointsPaginatedDto);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取码点信息' })
  @ApiObjResponse(PointEntity)
  QueryCard(@Param('id') id: string) {
    return this.pointsService.queryPoint(+id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '软删除单个' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  DeletePoint(@Param('id') id: string) {
    return this.pointsService.deletePoint(+id);
  }
}
