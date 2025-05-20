import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get('/vazamento')
  async sendMail() {
    await this.mailService.sendEmail({
      subject: 'Aviso de vazamento de dados',
      template: 'vazamento',
      context: {
        name: 'João',
      },
    });
    return {
      message: 'success',
    };
  }
}
