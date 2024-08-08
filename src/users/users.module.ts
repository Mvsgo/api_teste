import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/user.entity';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
})
export class UsersModule {}
