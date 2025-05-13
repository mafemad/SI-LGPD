import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentTerm } from './entities/consentTerm.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { ConsentTermService } from './consent-term.service';
import { ConsentTermController } from './consent-term.controller';
import { UserConsent } from './entities/userConsente.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentTerm, Preference, UserConsent, Notification, History])],
  providers: [ConsentTermService, NotificationService],
  controllers: [ConsentTermController],
  exports: [ConsentTermService,TypeOrmModule],
})
export class ConsentTermModule {}
