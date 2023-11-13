import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.model';
import { IUserModal } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: IUserModal): Promise<User> {
    try {
      const existingUser = await this.userService.findUserByEmail(user.email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
      return this.userService.createUser(user);
    } catch (error) {
      this.logger.error(`Error during signup: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: User }> {
    try {
      const user = await this.userService.findUserByCredentials(
        email,
        password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken, user };
    } catch (error) {
      this.logger.error(`Error during signin: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }
}
