// src/export-history/export-history.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportHistory } from './export-history.entity';
import { ExportHistoryService } from './export-history.service';
import { ExportHistoryController } from './export-history.controller';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExportHistory, User])],
  providers: [ExportHistoryService],
  controllers: [ExportHistoryController],
  exports: [ExportHistoryService],
})
export class ExportHistoryModule {}
