import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
const  User  = require('../user/user.entity');

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports:[UserService]
})
export class UserModule {}
