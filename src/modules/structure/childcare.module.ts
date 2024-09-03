import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ChildcareController } from './childcare.controller';
import { Childcare } from './childcare.entity';
import { ChildcareService } from './childcare.service';
import { ChildService } from '../child/child.service';
import { ChildModule } from '../child/child.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Childcare]),
    forwardRef(() => ChildModule),
    UserModule,
  ],
  providers: [ChildcareService],
  controllers: [ChildcareController],
  exports: [ChildcareService],
})
export class ChildcareModule {}
