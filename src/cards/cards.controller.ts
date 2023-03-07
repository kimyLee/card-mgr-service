import { CardEntity } from './entities/card.entity';
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

import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
} from '@/common/dto/response.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ApiPaginatedResponse } from '@/common/decorators/api-paginated-response.decorator';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { CardsPaginatedDto } from './dto/cards-pagination.dto';

@Controller('api/cards')
@ApiTags('cards')
@ApiExtraModels(
  CardEntity,
  ResponseDto,
  ResponseObjDto,
  ResponseListDto,
  ResPaginatedDto,
  ResponsePaginatedDto,
)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/import_cards')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '导入批次卡牌' })
  @ApiObjResponse(CardEntity)
  ImportCards() {
    return;
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
  // @ApiPaginatedResponse(CardEntity)
  QueryGroupIp() {
    return;
  }

  @Get('get_series_group')
  @Roles('ADMIN')
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: '获取 series group' })
  // @ApiPaginatedResponse(CardEntity)
  QueryGroupSeries() {
    return;
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
