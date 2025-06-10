import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';

import { Lead } from 'src/entities/lead.entity';
import { User } from 'src/entities/user.entity';
import { Property } from 'src/entities/property.entity';

import { LeadsService } from './leads.service';
import { LeadRepository } from 'src/repository/lead.repository';
import { LeadsController } from './leads.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, User, Property]),
    AuthModule,
    UsersModule,
    PropertiesModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadRepository],
})
export class LeadsModule {}
