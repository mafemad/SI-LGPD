import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPreference } from 'src/preferences/entities/userPreference.entity';
import { UserConsent } from 'src/consent-term/entities/userConsente.entity';
import { ConsentTerm } from 'src/consent-term/entities/consentTerm.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Preference)
    private prefRepo: Repository<Preference>,

    @InjectRepository(UserPreference)
    private userPrefRepo: Repository<UserPreference>,
    
    @InjectRepository(ConsentTerm)
    private termRepo: Repository<ConsentTerm>,
  
    @InjectRepository(UserConsent)
    private userConsentRepo: Repository<UserConsent>,
  ) {}

  async create(dto: CreateUserDto) {
    const term = await this.termRepo.findOne({
      where: { active: true },
      relations: ['preferences'],
    });
  
    if (!term) throw new Error('Nenhum termo ativo');
  
    const user = this.userRepo.create({
      name: dto.name,
      isAdmin: dto.isAdmin ?? false,
    });
  
    const savedUser = await this.userRepo.save(user);
  
    const userConsent = new UserConsent();
    userConsent.user = savedUser;
    userConsent.consentTerm = term;
    await this.userConsentRepo.save(userConsent);
  
    const userPrefs = term.preferences.map(pref => {
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
