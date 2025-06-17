import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PropertiesModule } from 'src/properties/properties.module';

import { Lead } from 'src/leads/entity/lead.entity';
import { User } from 'src/users/entity/user.entity';
import { Property } from 'src/properties/entity/property.entity';

import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadRepository } from './repository/lead.repository';

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
