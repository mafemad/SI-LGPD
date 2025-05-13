// src/export-history/export-history.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ExportHistoryService } from './export-history.service';

@Controller('export-history')
export class ExportHistoryController {
  constructor(private readonly exportHistoryService: ExportHistoryService) {}

  @Get()
  findAll() {
    return this.exportHistoryService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.exportHistoryService.findByUserId(userId);
  }
}
