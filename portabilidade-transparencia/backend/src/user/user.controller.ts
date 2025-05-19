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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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


  
}
