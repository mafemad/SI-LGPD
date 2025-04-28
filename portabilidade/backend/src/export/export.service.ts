// src/export/export.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ExportHistoryService } from '../export-history/export-history.service';
import { createObjectCsvStringifier } from 'csv-writer';
import * as PDFDocument from 'pdfkit';
import { MailerService } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ExportService {
  constructor(
    private readonly userService: UserService,
    private readonly exportHistoryService: ExportHistoryService,
    private readonly mailerService: MailerService,
  ) {}

  async exportUserData(userId: number, format: 'json' | 'csv' | 'pdf'): Promise<any> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    let fileContent: Buffer;

    if (format === 'json') {
      fileContent = Buffer.from(JSON.stringify(user, null, 2));
    } else if (format === 'csv') {
      const csv = createObjectCsvStringifier({
        header: Object.keys(user).map(key => ({ id: key, title: key })),
      });
      fileContent = Buffer.from(csv.getHeaderString() + csv.stringifyRecords([user]));
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {});

      doc.fontSize(16).text('Dados do Usuário', { underline: true });
      doc.moveDown();
      for (const [key, value] of Object.entries(user)) {
        doc.fontSize(12).text(`${key}: ${value}`);
      }
      doc.end();
      fileContent = await new Promise<Buffer>((resolve) => {
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });
      });
    } else {
      throw new Error('Formato inválido');
    }

    // Registra no histórico
    await this.exportHistoryService.create({
      userId: user.id,
      format,
    });

    return fileContent;
  }

  async sendByEmail(userId: number, format: 'json' | 'csv' | 'pdf', recipientEmail: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const fileContent = await this.exportUserData(userId, format);

    await this.mailerService.sendMail({
      to: recipientEmail,
      from: process.env.EMAIL_FROM,
      subject: 'Seus dados exportados',
      text: 'Segue em anexo o arquivo com seus dados pessoais conforme solicitado.',
      attachments: [
        {
          filename: `dados.${format}`,
          content: fileContent,
        },
      ],
    });
  }

  
}
