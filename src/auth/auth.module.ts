import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
const { JWT_SECRET_KEY, TOKEN_EXPIRATION_TIME } = process.env;

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, JwtStrategy],
})
export class AuthModule {}
