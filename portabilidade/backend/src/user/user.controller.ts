import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
