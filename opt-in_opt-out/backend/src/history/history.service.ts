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

  getByUser(userId: string) {
    return this.historyRepo.find({
      where: { userId },
      relations: ['preference'],
      order: { timestamp: 'DESC' },
    });
  }
}
