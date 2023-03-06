import { Request } from 'express';
import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';
import { UserEntity } from '@/users/entities/user.entity';

import { AuthService } from './auth.service';

import { AccessTokenDto } from './dto/access-token.dto';
import { LocalAuthDto } from './dto/local-auth.dto';

import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { ApiObjResponse } from '@/common/decorators/api-obj-response.decorator';
import { ResponseDto, ResponseObjDto } from '@/common/dto/response.dto';

@Controller('api/auth')
@ApiTags('auth')
@ApiExtraModels(ResponseDto, ResponseObjDto, AccessTokenDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Basic Authenticate for local strategy' })
  @ApiObjResponse(AccessTokenDto, HttpStatus.CREATED)
  @ApiObjResponse(AccessTokenDto, HttpStatus.OK)
  async Login(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _authDto: LocalAuthDto,
  ): Promise<any> {
    return this.authService.login(req.user as UserEntity);
  }
}
