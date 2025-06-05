import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { Property } from '../entities/property.entity';

/**
 * Servicio para manejar operaciones CRUD sobre propiedades.
 * Actualmente usa un array en memoria, pero puede ser reemplazado por un repositorio basado en TypeORM o cualquier ORM cuando se conecte a una base de datos real.
 */
@Injectable()
export class PropertiesService {
  private properties: Property[] = [];

  /**
   * Devuelve todas las propiedades almacenadas.
   */
  findAll(): Property[] {
    return this.properties;
  }

  /**
   * Busca y devuelve una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  findOne(id: number): Property {
    const property = this.properties.find((property) => property.id === id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  /**
   * Crea una nueva propiedad a partir de los datos proporcionados.
   * Asigna un ID temporal aleatorio y registra fechas de creación y actualización.
   * @param createPropertyDto - Datos iniciales de la propiedad
   * @returns La propiedad creada
   */
  create(createPropertyDto: CreatePropertyDto): Property {
    const newProperty: Property = {
      ...createPropertyDto,
      id: Math.floor(Math.random() * 1_000_000_000), // ID temporal simulado
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.properties.push(newProperty);
    return newProperty;
  }

  /**
   * Actualiza una propiedad existente con nuevos datos.
   * @param id - Identificador único de la propiedad
   * @param updatePropertyDto - Nuevos datos parciales de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   * @returns La propiedad actualizada
   */
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

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  remove(id: number): void {
    const index = this.properties.findIndex((property) => property.id === id);
    if (index < 0) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    this.properties.splice(index, 1);
  }

  /**
   * Busca propiedades por título o ubicación que coincidan con el término de búsqueda.
   * @param query - Término de búsqueda
   * @returns Array de propiedades coincidentes
   */
  search(query: string): Property[] {
    const searchTerm = query.toLowerCase();
    return this.properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm),
    );
  }
}
