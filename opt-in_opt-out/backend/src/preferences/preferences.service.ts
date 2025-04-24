import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { History } from '../history/entities/history.entity';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(History)
    private historyRepo: Repository<History>,
  ) {}

  async updatePreferences(userId: string, dto: UpdatePreferenceDto) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['preference'] });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const pref = user.preference;
    const historyEntries: Partial<History>[] = [];

    for (const key of ['pushNotifications', 'emailPromotions', 'smsMessages']) {
      if (dto[key] !== undefined && dto[key] !== pref[key]) {
        historyEntries.push({
          userId,
          preferenceType: key === 'pushNotifications' ? 'push' : key === 'emailPromotions' ? 'email' : 'sms',
          action: dto[key] ? 'opt-in' : 'opt-out',
        });
        pref[key] = dto[key];
      }
    }

    await this.historyRepo.save(historyEntries);
    return this.userRepo.save(user);
  }
}
