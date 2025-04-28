import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportHistory } from 'src/export-history/export-history.entity';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExportHistory, User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
