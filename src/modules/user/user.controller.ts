import { Body, Controller, Get, Logger, NotFoundException, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUserByUsername(@Query('username') username: string): Promise<User> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;  }

  @Put()
  async createOrUpdateUser(
    @Body('email') email: string,
    @Body('username') username: string,
  ): Promise<User> {
    return this.userService.createOrUpdateUser(email, username);
  }
}
