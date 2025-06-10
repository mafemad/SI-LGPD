import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule, // 👈 ADICIONE AQUI
 
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE || 'db.sqlite',
      entities: [User],
      synchronize: true,
    }),
    
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
