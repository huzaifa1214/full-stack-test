import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { IUserModal } from './user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: IUserModal): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const createdUser = new this.userModel({
        ...user,
        password: hashedPassword,
      });
      return createdUser.save();
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new BadRequestException('Could not create user');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(
        `Error finding user by email: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Could not find user by email');
    }
  }

  async findUserByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await this.findUserByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Error finding user by credentials: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Could not find user by credentials');
    }
  }
}
