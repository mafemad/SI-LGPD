import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportHistory } from 'src/export-history/export-history.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExportHistory, User])],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
