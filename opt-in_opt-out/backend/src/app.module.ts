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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Preference, UserPreference, History],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Preference, UserPreference, History]),
    AuthModule,
  ],
  controllers: [UserController, PreferenceController, HistoryController],
  providers: [UserService, PreferenceService, HistoryService],
})
export class AppModule {}
