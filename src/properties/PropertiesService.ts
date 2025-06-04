import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from 'src/entities/property.entity';
import { UpdatePropertyDto } from 'src/dto/update-property.dto';
import { CreatePropertyDto } from 'src/dto/create-property.dto';

@Injectable()
export class PropertiesService {
  private properties: Property[] = [];

  findAll(): Property[] {
    return this.properties;
  }

  findOne(id: number): Property {
    const property = this.properties.find((property) => property.id === id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  create(createPropertyDto: CreatePropertyDto): Property {
    const newProperty: Property = {
      ...createPropertyDto,
      id: Math.floor(Math.random() * 1_000_000_000), // Simulando un ID numérico aleatorio
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.properties.push(newProperty);
    return newProperty;
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto): Property {
    const index = this.properties.findIndex((property) => property.id === id);
    if (index < 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const updated = {
      ...this.properties[index],
      ...updatePropertyDto,
      updatedAt: new Date(),
    };

    this.properties[index] = updated;
    return updated;
  }

  remove(id: number): void {
    const index = this.properties.findIndex((property) => property.id === id);
    if (index < 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    this.properties.splice(index, 1);
  }
}
