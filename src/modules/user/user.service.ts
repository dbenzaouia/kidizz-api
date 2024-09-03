import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    this.logger.log(`Finding user with username: ${username}`);

    const user = await this.userRepository.findOne({ where: { username } });
    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    return user || null;
  }

  async createOrUpdateUser(email: string, username: string): Promise<User> {
    let user = await this.userRepository.createOrUpdateUser(email, username);

    if (user) {
      user.username = username;
    } else {
      user = this.userRepository.create({ email, username });
    }

    return this.userRepository.save(user);
  }
}
