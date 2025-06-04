import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from 'src/dto/create-property.dto';
import { Property } from 'src/entities/property.entity';
import { PropertiesService } from './PropertiesService';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  getAll(): Property[] {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Property {
    const property = this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto): Property {
    return this.propertiesService.create(createPropertyDto);
  }
}
