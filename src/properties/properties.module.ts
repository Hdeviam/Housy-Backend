import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './PropertiesService';
import { PropertyRepository } from 'src/repository/property.repository';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertyRepository],
})
export class PropertiesModule {}
