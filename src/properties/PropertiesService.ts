import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm'; // 👈 Importa Raw
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find();
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOneBy({ id });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(dto);
    return await this.propertyRepository.save(property);
  }

  async update(id: number, dto: UpdatePropertyDto): Promise<Property> {
    const existingProperty = await this.propertyRepository.findOneBy({ id });

    if (!existingProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const updatedProperty = this.propertyRepository.merge(existingProperty, dto);
    return await this.propertyRepository.save(updatedProperty);
  }

  async remove(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  async search(query: string): Promise<Property[]> {
    const searchTerm = query.toLowerCase();
    return this.propertyRepository.find({
      where: [
        { title: Raw((alias) => `LOWER(${alias}) LIKE '%${searchTerm}%'`) },
        { location: Raw((alias) => `LOWER(${alias}) LIKE '%${searchTerm}%'`) },
      ],
    });
  }
}
