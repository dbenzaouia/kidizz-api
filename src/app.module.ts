import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ChildcareModule } from './modules/structure/childcare.module';
import { ChildModule } from './modules/child/child.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432,
      username: 'postgres', 
      password: 'postgres', 
      database: 'test',
      entities: [__dirname + '/modules/**/*.entity{.ts,.js}'], 
      synchronize: true,
    }),
    UserModule,
    ChildcareModule,
    ChildModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
