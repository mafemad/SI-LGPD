import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Preference } from './preferences/entities/preference.entity';
import { History } from './history/entities/history.entity';
import { UserService } from './user/user.service';
import { PreferenceService } from './preferences/preferences.service';
import { HistoryService } from './history/history.service';
import { UserController } from './user/user.controller';
import { PreferenceController } from './preferences/preferences.controller';
import { HistoryController } from './history/history.controller';
import { AuthModule } from './auth/auth.module';
import { UserPreference } from './preferences/entities/userPreference.entity';
import { Notification } from './notification/entities/notification.entity';
import { NotificationModule } from './notification/notification.module';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Preference, UserPreference, History, Notification],
      synchronize: true,
      extra: {
        foreign_keys: true, // Habilitar restrições de chaves estrangeiras
      },
    }),
    TypeOrmModule.forFeature([User, Preference, UserPreference, History, Notification]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [UserController, PreferenceController, HistoryController,NotificationController],
  providers: [UserService, PreferenceService, HistoryService, NotificationService],
})
export class AppModule {}
