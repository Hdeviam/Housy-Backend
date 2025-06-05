import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './PropertiesService';
import { PropertyRepository } from 'src/repository/property.repository';
import { AuthModule } from 'src/auth/auth.module'; // 👈 Importa AuthModule

@Module({
  imports: [AuthModule], // 👈 Asegura que JwtService esté disponible
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyRepository],
})
export class PropertiesModule {}
