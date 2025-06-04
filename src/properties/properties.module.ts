import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './PropertiesService';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
