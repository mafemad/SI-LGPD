import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

const loginAttempts: { [key: string]: { count: number; lastAttempt: number } } = {};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

    async login(email: string, password: string) {
  const now = Date.now();
  const key = email;
  const record = loginAttempts[key] || { count: 0, lastAttempt: 0 };

  if (now - record.lastAttempt > 10 * 60 * 1000) {
    record.count = 0;
  }

  if (record.count >= 3) {
    throw new ForbiddenException('Muitas tentativas. Tente novamente mais tarde.');
  }

  const user = await this.userService.findByEmail(email);

  const isPasswordValid = user && await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    record.count += 1;
    record.lastAttempt = now;
    loginAttempts[key] = record;
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  loginAttempts[key] = { count: 0, lastAttempt: now };

  const payload = { email: user.email, sub: user.id };
  const token = this.jwtService.sign(payload);

  const response = {
    message: 'Login realizado com sucesso',
    access_token: token,
    user: {
      name:user.name,
      id: user.id,
      email: user.email,
      cpf: user.cpf,
      address: user.address,
      age: user.age,
    }
  };

  
  console.log('Resposta da requisição de login:', response);

  return response;
}

}
