import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './PropertiesService';
import { PropertyRepository } from 'src/repository/property.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/entities/property.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Property]), // 👈 Registra la entidad Property
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyRepository],
})
export class PropertiesModule {}
