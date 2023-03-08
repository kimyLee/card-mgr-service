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
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Express } from 'express';

import * as XLSX from 'xlsx';

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
  // @ApiObjResponse(CardEntity)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cards for batch',
    type: FileUploadDto,
  })
  ImportCards(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
    });

    /* Get the work sheet name */
    const first_sheet_name = workbook.SheetNames[0];

    /* Get worksheet */
    const worksheet = workbook.Sheets[first_sheet_name];

    /* Convert it to json*/
    const xlsData = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
    });

    return xlsData;
  }

  @Post('/export_points')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导出卡牌码点' })
  @ApiObjResponse(CardEntity)
  ExportPoints() {
    return;
  }

  @Post()
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '创建卡牌' }) // 超级管理员才能创建用户
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
