import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { History } from '../history/entities/history.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { UserPreference } from './entities/userPreference.entity';
import { Preference } from './entities/preference.entity';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(UserPreference)
    private userPrefRepo: Repository<UserPreference>,

    @InjectRepository(Preference)
    private prefRepo: Repository<Preference>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(History)
    private historyRepo: Repository<History>,
  ) {}

  async updatePreferences(userId: string, updates: { [prefId: string]: boolean }) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const userPrefs = await this.userPrefRepo.find({
      where: { user: { id: userId } },
      relations: ['preference'],
    });

    const historyEntries: Partial<History>[] = [];

    for (const userPref of userPrefs) {
      const newValue = updates[userPref.preference.id];
      if (newValue !== undefined && newValue !== userPref.optedIn) {
        historyEntries.push({
          userId,
          preference: userPref.preference,
          action: newValue ? 'opt-in' : 'opt-out',
        });
        userPref.optedIn = newValue;
      }
    }

    await this.userPrefRepo.save(userPrefs);
    await this.historyRepo.save(historyEntries);
    return { message: 'Preferências atualizadas com sucesso.' };
  }

  // Admin: criar nova preferência
  async createPreference(name: string, description?: string) {
    const exists = await this.prefRepo.findOne({ where: { name } });
    if (exists) throw new Error('Preferência já existe');

    const pref = this.prefRepo.create({ name, description });
    const newPref = await this.prefRepo.save(pref);

    const users = await this.userRepo.find();
    const userPrefs = users.map(user => {
      const up = new UserPreference();
      up.user = user;
      up.preference = newPref;
      up.optedIn = false;
      return up;
    });

    await this.userPrefRepo.save(userPrefs);
    return newPref;
  }

  // Admin: deletar preferência
  async deletePreference(prefId: string) {
    await this.userPrefRepo.delete({ preference: { id: prefId } });
    await this.prefRepo.delete(prefId);
  }
}

