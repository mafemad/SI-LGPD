import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(email: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      return { message: 'Login successful', user };
    } else {
      throw new Error('User not found');
    }
  }
}
