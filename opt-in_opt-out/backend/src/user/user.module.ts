import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentTerm } from 'src/consent-term/entities/consentTerm.entity';
import { Preference } from 'src/preferences/entities/preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentTerm, Preference])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
