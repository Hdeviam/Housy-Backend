import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Property } from 'src/properties/entity/property.entity';
import { Visit } from 'src/visits/entity/visit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Property, Visit]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
