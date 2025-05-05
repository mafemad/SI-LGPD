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

    const allPreferences = await this.prefRepo.find();
    const userPrefs = allPreferences.map(pref => {
      const up = new UserPreference();
      up.user = savedUser;
      up.preference = pref;
      up.optedIn = dto.preferences?.[pref.name] ?? false;
      return up;
    });

    await this.userPrefRepo.save(userPrefs);

    return this.getUserWithPreferenceMap(savedUser.id);
  }

  async findAll() {
    const users = await this.userRepo.find({
      relations: ['preferences', 'preferences.preference'],
    });

    return users.map(user => this.transformUser(user));
  }

  private transformUser(user: User) {
    const preferenceMap: Record<string, boolean> = {};

    for (const up of user.preferences || []) {
      if (up.preference?.name) {
        preferenceMap[up.preference.name] = up.optedIn;
      }
    }

    return {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      preferences: preferenceMap,
    };
  }

  private async getUserWithPreferenceMap(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['preferences', 'preferences.preference'],
    });

    if (!user) return null;
    return this.transformUser(user);
  }
}
