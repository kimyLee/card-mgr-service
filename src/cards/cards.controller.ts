import { BatchEntity } from '@/batches/entities/batch.entity';
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
  Res,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Express, Response } from 'express';

import {
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
} from '@/common/dto/response.dto';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { ApiListResponse } from '@/common/decorators/api-list-response.decorator';

import { CardsService } from './cards.service';
import { CardEntity } from './entities/card.entity';

import { CardsPaginatedDto } from './dto/cards-pagination.dto';
import { QueryGroupIpDto } from './dto/query-group-ip.dto';
import { QueryGroupSeriesDto } from './dto/query-group-series.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-upload.dto';
import { FileDownloadDto } from './dto/file-download.dto';

@Controller('api/cards')
@ApiTags('cards')
@ApiExtraModels(
  CardEntity,
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
  QueryGroupIpDto,
  QueryGroupSeriesDto,
)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/import_cards')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导入批次卡牌' })
  @ApiObjResponse(BatchEntity)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async ImportCardsCreateBatch(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto: FileUploadDto,
  ) {
    return this.cardsService.importCardsCreateBatch(file, fileUploadDto);
  }

  @Get('/get_cards_with_batch')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '按批次查询卡牌' })
  @ApiListResponse(CardEntity)
  QueryCardsWithBatch(@Query() fileDownloadDto: FileDownloadDto) {
    return this.cardsService.queryCardsWithBatch(fileDownloadDto);
  }

  @Post('/export_points')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导出批次卡牌xlsx' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '导出xlsx' })
  ExportCardsWithBatch(
    @Query() fileDownloadDto: FileDownloadDto,
    @Res() res: Response,
  ) {
    return this.cardsService.exportCardsWithBatch(fileDownloadDto, res);
  }

  @Get('get_ip_group')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 ip group' })
  @ApiListResponse(QueryGroupIpDto)
  QueryGroupIp() {
    return this.cardsService.queryGroupIp();
  }

  @Get('get_series_group')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 series group' })
  @ApiListResponse(QueryGroupSeriesDto)
  QueryGroupSeries() {
    return this.cardsService.queryGroupSeries();
  }

  @Get()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '分页获取卡牌列表' })
  @ApiPaginatedResponse(CardEntity)
  QueryAllCards(@Query() cardsPaginatedDto: CardsPaginatedDto) {
    return this.cardsService.queryAllCards(cardsPaginatedDto);
  }

  @Get(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取卡牌信息' })
  @ApiObjResponse(CardEntity)
  QueryCard(@Param('id') id: string) {
    return this.cardsService.queryCard(+id);
  }

  @Patch(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '更新卡牌信息' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  UpdateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.updateCard(+id, updateCardDto);
  }

  @Post()
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'BETA: 向某一批次追加创建卡牌, 创建单张卡牌慎用' })
  @ApiObjResponse(CardEntity)
  CreateCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(createCardDto);
  }

  @Delete(':id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'BETA: 软删除单个卡牌, 慎用' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  DeleteCard(@Param('id') id: string) {
    return this.cardsService.deleteCard(+id);
  }

  @Delete('delete_batch/:batch_id')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '软删除批次以及批次下所有卡牌' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  DeleteBatchWithCards(@Param('batch_id') batch_id: string) {
    return this.cardsService.deleteBatchWithCards(+batch_id);
  }
}
