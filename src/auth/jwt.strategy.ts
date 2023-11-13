import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'hello',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { sub, email } = payload;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return { userId: sub, email: user.email };
  }
}
