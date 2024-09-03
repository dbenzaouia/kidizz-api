import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ChildController } from './child.controller';
import { Child } from './child.entity';
import { ChildService } from './child.service';
import { ChildcareModule } from '../structure/childcare.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Child]),
    forwardRef(() => ChildcareModule),
    UserModule,
  ],
  providers: [ChildService],
  controllers: [ChildController],
  exports: [ChildService],
})
export class ChildModule {}
