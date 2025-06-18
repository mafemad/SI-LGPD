import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async create(data: Partial<User>) {
    if (!data.password) {
      throw new BadRequestException('A senha é obrigatória.');
    }

    if (!this.isPasswordStrong(data.password)) {
      throw new BadRequestException(
        'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.'
      );
    }

    const userExists = await this.userRepo.findOne({ where: { email: data.email } });

    if (userExists) {
      throw new BadRequestException('Email já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepo.create({
      ...data,
      password: hashedPassword,
      shareData: data.shareData ?? true,
    });

    return this.userRepo.save(user);
  }

  private isPasswordStrong(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findById(id: number) {
    return await this.userRepo.findOne({
      where: { id },
      select: ['id', 'name', 'cpf', 'email', 'address', 'age', 'shareData'], 
    });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<User>) {
    if (data.password && !this.isPasswordStrong(data.password)) {
      throw new BadRequestException(
        'A nova senha deve ser forte (mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo).'
      );
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
