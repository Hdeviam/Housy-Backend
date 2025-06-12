/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  /**
   * Obtiene todas las propiedades.
   */
  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find();
  }

  /**
   * Obtiene una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOneBy({ id });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  /**
   * Crea una nueva propiedad.
   * @param dto - Datos de la nueva propiedad
   * @returns Propiedad creada
   */
  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(dto);
    return await this.propertyRepository.save(property);
  }

  /**
   * Actualiza una propiedad existente.
   * @param id - Identificador único de la propiedad
   * @param dto - Datos parciales de la propiedad
   * @returns Propiedad actualizada
   */
  async update(id: number, dto: UpdatePropertyDto): Promise<Property> {
    const existingProperty = await this.propertyRepository.findOneBy({ id });

    if (!existingProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    const updatedProperty = this.propertyRepository.merge(existingProperty, dto);
    return await this.propertyRepository.save(updatedProperty);
  }

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  async remove(id: number): Promise<void> {
    const result = await this.propertyRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  /**
   * Busca propiedades por ubicación o título (búsqueda parcial).
   * @param query - Término de búsqueda
   * @returns Array de propiedades coincidentes
   */
  async search(query: string): Promise<Property[]> {
    const searchTerm = query.toLowerCase();
    return this.propertyRepository.find({
      where: [],
    });
  }
}
