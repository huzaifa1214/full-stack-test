import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/user.model';
import { JwtModule } from '@nestjs/jwt';
const { JWT_SECRET_KEY, TOKEN_EXPIRATION_TIME, DATABASE_URL } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: TOKEN_EXPIRATION_TIME },
    }),
    AuthModule,
  ],
})
export class AppModule {}
