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
import { Roles } from '@/common/decorators/roles.decorator';
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
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导入批次卡牌' })
  @ApiListResponse(CardEntity)
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
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '按批次查询卡牌' })
  @ApiListResponse(CardEntity)
  QueryCardsWithBatch(@Query() fileDownloadDto: FileDownloadDto) {
    return this.cardsService.queryCardsWithBatch(fileDownloadDto);
  }

  @Post('/export_points')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导出批次卡牌list' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '导出xlsx' })
  ExportCardsWithBatch(
    @Query() fileDownloadDto: FileDownloadDto,
    @Res() res: Response,
  ) {
    return this.cardsService.exportCardsWithBatch(fileDownloadDto, res);
  }

  @Post()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '向某一批次追加创建卡牌' })
  @ApiObjResponse(CardEntity)
  CreateCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(createCardDto);
  }

  @Get('get_ip_group')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 ip group' })
  @ApiListResponse(QueryGroupIpDto)
  QueryGroupIp() {
    return this.cardsService.queryGroupIp();
  }

  @Get('get_series_group')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 series group' })
  @ApiListResponse(QueryGroupSeriesDto)
  QueryGroupSeries() {
    return this.cardsService.queryGroupSeries();
  }

  @Get()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取卡牌列表' })
  @ApiPaginatedResponse(CardEntity)
  QueryAllCards(@Query() cardsPaginatedDto: CardsPaginatedDto) {
    return this.cardsService.queryAllCards(cardsPaginatedDto);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取卡牌信息' })
  @ApiObjResponse(CardEntity)
  QueryCard(@Param('id') id: string) {
    return this.cardsService.queryCard(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '更新卡牌信息' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  UpdateCard(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.updateCard(+id, updateCardDto);
  }

  @Patch('/partner/:id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '从合作方更新卡牌信息，接口待定' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  UpdateCardFormPartner(@Param('id') id: string) {
    // return this.cardsService.updateCard(+id, updateCardDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '软删除单个' })
  @ApiOkResponse({
    type: ResponseDto,
  })
  DeleteCard(@Param('id') id: string) {
    return this.cardsService.deleteCard(+id);
  }
}
