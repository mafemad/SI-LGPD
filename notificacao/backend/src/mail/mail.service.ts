// import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
// import { Injectable, Logger } from '@nestjs/common';
// import { User } from 'src/user/entities/user.entity';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class MailService {
//   private readonly logger = new Logger(MailService.name);

//   constructor(
//     private readonly mailerService: MailerService,
//     private readonly userService: UserService,
//   ) {}

//   async sendEmail() {
//     try {
//       const usersList: User[] = await this.userService.findAll();

//       usersList.forEach(async (user) => {
//         if (!user.email) {
//           this.logger.warn(
//             `User with ID ${user.id} does not have an email address.`,
//           );
//           return;
//         }

//         const sendMailParams: ISendMailOptions = {
//           from: process.env.SMTP_FROM,
//           to: user.email,
//           subject: 'Alerta de vazamento de dados',
//           template: 'vazamento',
//           context: {
//             name: user.name,
//           },
//         };
//         await this.mailerService.sendMail(sendMailParams);
//         this.logger.log(
//           `Email sent successfully to recipients with the following parameters : ${JSON.stringify(
//             sendMailParams,
//           )}`,
//         );
//       });

//       return {
//         message: 'Emails sent successfully',
//       };
//     } catch (error) {
//       this.logger.error(`Something went wrong while sending mail: ${error}}`);
//       throw new Error(`Something went wrong while sending mail: ${error}`);
//     }
//   }
// }
