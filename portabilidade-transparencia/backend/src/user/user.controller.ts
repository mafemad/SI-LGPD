import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findById(@Param('id') id: number, @Req() req) {
    if (req.user.id !== Number(id)) {
      throw new ForbiddenException('Você só pode visualizar seus próprios dados.');
    }
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() body: any, @Req() req) {
    if (req.user.id !== Number(id)) {
      throw new ForbiddenException('Você só pode atualizar sua própria conta.');
    }
    return this.userService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('redirect-url')
  async getEncryptedRedirectUrl(@Req() req) {
    const SECRET_KEY = this.configService.get<string>('CRYPTO_SECRET');

    const user = await this.userService.findById(req.user.id);

    const safeUser = {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      address: user.address,
      age: user.age,
    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(safeUser), SECRET_KEY).toString();
    const encoded = encodeURIComponent(encrypted);

    return {
      redirectUrl: `http://localhost:5173/profile?data=${encoded}`,
    };
  }
}
