import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './users.model';
import { JwtCustomModule } from '../jwt/jwt.module'
import { JwtModule } from '@nestjs/jwt';
@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    JwtCustomModule,
    JwtModule,
    SequelizeModule.forFeature([Users]),
  ],
  exports: [UsersService]
})
export class UsersModule { }
