import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Preference } from 'src/preferences/entities/preference.entity';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Preference, History])],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
