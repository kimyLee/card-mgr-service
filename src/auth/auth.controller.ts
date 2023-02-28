import { Request } from 'express';
import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserEntity } from '@/user/user.entity';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { LocalAuthDto } from './models/local-auth.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Basic Authenticate for local strategy' })
  async Login(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _authDto: LocalAuthDto,
  ): Promise<any> {
    return this.authService.login(req.user as UserEntity);
  }
}
