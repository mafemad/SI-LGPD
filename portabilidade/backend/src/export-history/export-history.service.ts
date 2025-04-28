// src/export-history/export-history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportHistory } from './export-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExportHistoryService {
  constructor(
    @InjectRepository(ExportHistory)
    private exportHistoryRepo: Repository<ExportHistory>,
  ) {}

  create(data: Partial<ExportHistory>) {
    const exportRecord = this.exportHistoryRepo.create(data);
    return this.exportHistoryRepo.save(exportRecord);
  }

  findAll() {
    return this.exportHistoryRepo.find();
  }

  findByUserId(userId: number) {
    return this.exportHistoryRepo.find({ where: { userId } });
  }
}
