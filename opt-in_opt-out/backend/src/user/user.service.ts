import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Preference)
    private prefRepo: Repository<Preference>,
  ) {}

  async create(dto: CreateUserDto) {
    const preference = this.prefRepo.create({
      pushNotifications: dto.pushNotifications,
      emailPromotions: dto.emailPromotions,
      smsMessages: dto.smsMessages,
    });

    const user = this.userRepo.create({
      name: dto.name,
      isAdmin: dto.isAdmin ?? false,
      preference,
    });

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find({ relations: ['preference'] });
  }
}
