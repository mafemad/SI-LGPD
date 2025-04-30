// src/export/export.controller.ts
import { Controller, Get, Param, Res, Query, Post, Body } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get(':userId')
  async exportUserData(
    @Param('userId') userId: number,
    @Query('format') format: 'json' | 'csv' | 'pdf',
    @Res() res: Response,
  ) {
    const file = await this.exportService.exportUserData(userId, format);
    res.set({
      'Content-Type': this.getMimeType(format),
      'Content-Disposition': `attachment; filename="dados.${format}"`,
    });
    res.send(file);
  }

  @Post('send-email/:userId')
  async sendByEmail(
    @Param('userId') userId: number,
    @Body() body: { format: 'json' | 'csv' | 'pdf' }
  ) {
    await this.exportService.sendByEmail(userId, body.format);
    return { message: 'Email enviado com sucesso!' };
  }
  
  private getMimeType(format: string): string {
    if (format === 'json') return 'application/json';
    if (format === 'csv') return 'text/csv';
    if (format === 'pdf') return 'application/pdf';
    return 'application/octet-stream';
  }
}
