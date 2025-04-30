import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { name: dto.name },
      relations: ['preferences', 'preferences.preference'],
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const preferences = user.preferences.reduce((acc, up) => {
      acc[up.preference.name] = up.optedIn;
      return acc;
    }, {} as Record<string, boolean>);

    return {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      preferences,
    };
  }
}
