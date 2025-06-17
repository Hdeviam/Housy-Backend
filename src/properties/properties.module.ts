import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './PropertiesService';
import { PropertyRepository } from 'src/properties/repository/property.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from 'src/properties/entity/property.entity';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Property]), // 👈 Registra la entidad Property
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyRepository],
  exports: [TypeOrmModule],
})
export class PropertiesModule {}
