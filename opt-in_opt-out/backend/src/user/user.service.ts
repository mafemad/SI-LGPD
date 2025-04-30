import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPreference } from 'src/preferences/entities/userPreference.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Preference)
    private prefRepo: Repository<Preference>,

    @InjectRepository(UserPreference)
    private userPrefRepo: Repository<UserPreference>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create({
      name: dto.name,
      isAdmin: dto.isAdmin ?? false,
    });

    const savedUser = await this.userRepo.save(user);

    // Busca todas as preferências existentes para aplicar ao usuário
    const allPreferences = await this.prefRepo.find();
    const userPrefs = allPreferences.map(pref => {
      const up = new UserPreference();
      up.user = savedUser;
      up.preference = pref;
      up.optedIn = false; // padrão: desativado
      return up;
    });

    await this.userPrefRepo.save(userPrefs);
    return this.userRepo.findOne({
      where: { id: savedUser.id },
      relations: ['preferences', 'preferences.preference'],
    });
  }

  findAll() {
    return this.userRepo.find({
      relations: ['preferences', 'preferences.preference'],
    });
  }
}
