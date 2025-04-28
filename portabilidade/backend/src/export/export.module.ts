import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportHistory } from 'src/export-history/export-history.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ExportHistoryService } from 'src/export-history/export-history.service';


@Module({
  imports: [TypeOrmModule.forFeature([ExportHistory, User])],
  controllers: [ExportController],
  providers: [ExportService, UserService, ExportHistoryService],
})
export class ExportModule {}
