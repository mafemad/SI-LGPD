// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ExportHistory } from './export-history/export-history.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExportModule } from './export/export.module';
import { ExportHistoryModule } from './export-history/export-history.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "", 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, ExportHistory],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ExportModule,
    ExportHistoryModule,
  ],
})
export class AppModule {}
