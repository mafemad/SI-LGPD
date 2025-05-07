import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepo: Repository<History>,
  ) {}

  async getByUser(userId: string) {
    const entries = await this.historyRepo.find({
      where: { userId },
      relations: ['preference', 'consentTerm'],
      order: { timestamp: 'DESC' },
    });
  
    return entries.map(e => ({
      ...e,
      termVersion: e.consentTerm?.version,
    }));
  }
}
