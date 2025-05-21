import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async sendEmail(params: {
    subject: string;
    template: string;
    context: ISendMailOptions['context'];
  }) {
    try {
      const emailsList: string[] = (await this.userService.findAll()).map(
        (user) => {
          return user.email;
        },
      );

      emailsList.forEach(async (email) => {
        if (!email) {
          throw new Error(
            `Invalid email address found in SMTP_TO env var, please check your .env file`,
          );
        }
        const sendMailParams: ISendMailOptions = {
          from: process.env.FROM,
          to: email,
          subject: params.subject,
          template: params.template,
          context: params.context,
        };
        await this.mailerService.sendMail(sendMailParams);
        this.logger.log(
          `Email sent successfully to recipients with the following parameters : ${JSON.stringify(
            sendMailParams,
          )}`,
        );
      });
    } catch (error) {
      this.logger.error(
        `Error while sending mail with the following parameters : ${JSON.stringify(
          params,
        )}`,
        error,
      );
    }
  }
}
