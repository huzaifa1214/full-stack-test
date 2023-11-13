import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUserModal } from 'src/user/user.interface';
import { CreateUserDTO, SignInDTO } from './auth.dto';
import { UserDTO, UserLoginDTO } from 'src/user/user.dto';
import UserMapper from 'src/user/user.mapper';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) userDto: CreateUserDTO): Promise<UserDTO> {
    try {
      const user: IUserModal = {
        email: userDto.email,
        name: userDto.name,
        password: userDto.password,
      };
      const createdUser = await this.authService.signUp(user);
      const mappedUser = UserMapper.toDTO([createdUser])[0];
      return mappedUser;
    } catch (error) {
      this.logger.error(`Error during signup: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post('login')
  async signIn(
    @Body(ValidationPipe) userDto: SignInDTO,
  ): Promise<UserLoginDTO> {
    try {
      const { accessToken, user } = await this.authService.signIn(
        userDto.email,
        userDto.password,
      );
      const mappedUser = UserMapper.toDTO([user])[0];
      return { accessToken, user: mappedUser };
    } catch (error) {
      this.logger.error(`Error during signin: ${error.message}`, error.stack);
      throw error;
    }
  }
}
