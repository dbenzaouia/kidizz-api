import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
      }
  async findByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }

  async createOrUpdateUser(email: string, username: string): Promise<User> {
    let user = await this.findOne({ where: { email } });

    if (user) {
      user.username = username;
    } else {
      user = this.create({ email, username });
    }

    return this.save(user);
  }
}
