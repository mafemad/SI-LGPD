import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'segredo_supersecreto',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
    };
  }
}
