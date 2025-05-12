import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsentTerm } from './entities/consentTerm.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { UserConsent } from './entities/userConsente.entity';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConsentTermService {
  constructor(
    @InjectRepository(ConsentTerm)
    private termRepo: Repository<ConsentTerm>,

    @InjectRepository(Preference)
    private prefRepo: Repository<Preference>,

    @InjectRepository(UserConsent)
    private userConsentRepo: Repository<UserConsent>,

    private readonly notificationService: NotificationService,
  ) {}

  async create(
    content: string,
    preferenceIds: string[],
    newPreferences: { name: string; description?: string }[],
  ) {
    // Desativa todos os termos ativos antes de criar um novo
    await this.termRepo.update({ active: true }, { active: false });
  
    const [last] = await this.termRepo.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });
  
    const existingPrefs = await this.prefRepo.findByIds(preferenceIds);
  
    const createdPrefs: Preference[] = [];
  
    for (const newPref of newPreferences) {
      const exists = await this.prefRepo.findOne({ where: { name: newPref.name } });
      if (!exists) {
        const pref = this.prefRepo.create(newPref);
        const saved = await this.prefRepo.save(pref);
        createdPrefs.push(saved);
      } else {
        createdPrefs.push(exists);
      }
    }
  
    const preferences = [...existingPrefs, ...createdPrefs];
  
    const newTerm = this.termRepo.create({
      content,
      version: (last?.version || 0) + 1,
      active: true,
      preferences,
    });
  
    const savedTerm = await this.termRepo.save(newTerm);
  
    const users = await this.userConsentRepo.manager.find(User);
    for (const user of users) {
      await this.notificationService.create(
        user,
        `Novo termo de consentimento disponível. Versão ${savedTerm.version}`,
        'new_term'
      );
    }
  
    return savedTerm;
  }
  

  async getActive() {
    const term = await this.termRepo.findOne({
      where: { active: true },
      relations: ['preferences'],
    });
    if (!term) throw new NotFoundException('Nenhum termo ativo encontrado');
    return term;
  }

  async getAcceptedTerm(userId: string): Promise<ConsentTerm | null> {
    const accepted = await this.userConsentRepo.findOne({
      where: { user: { id: userId } },
      order: { acceptedAt: 'DESC' },
      relations: ['consentTerm'],
    });

    return accepted?.consentTerm || null;
  }

  async getTerms(active?: boolean) {
    const where = active !== undefined ? { active } : {};
    return this.termRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['preferences'],
    });
  }
  
  async acceptTerm(userId: string, termId: string) {
    const user = await this.userConsentRepo.manager.findOne(User, {
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
  
    const term = await this.termRepo.findOne({
      where: { id: termId, active: true },
    });
    if (!term) throw new NotFoundException('Termo não encontrado ou inativo');
  
    const existing = await this.userConsentRepo.findOne({
      where: { user: { id: userId }, consentTerm: { id: termId } },
    });
  
    if (existing) {
      return { message: 'Termo já aceito anteriormente.' };
    }
  
    const consent = this.userConsentRepo.create({
      user,
      consentTerm: term,
    });
  
    await this.userConsentRepo.save(consent);
  
    return { message: 'Termo aceito com sucesso.' };
  }
  
}
