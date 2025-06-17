import { Property } from '../entity/property.entity';

/**
 * Clase que simula una capa de acceso a datos para entidades de tipo Property.
 * Esta implementación es temporal y se usará únicamente para desarrollo local,
 * hasta que se integre con una base de datos real (por ejemplo, PostgreSQL).
 */
export class PropertyRepository {
  [x: string]: any;
  private readonly properties: Property[] = [];

  /**
   * Obtiene todas las propiedades almacenadas en memoria.
   * @returns Array de objetos Property
   */
  findAll(): Property[] {
    return this.properties;
  }

  /**
   * Busca una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @returns Objeto Property si existe, undefined si no
   */
  findOne(id: number): Property | undefined {
    return this.properties.find((property) => property.id === id);
  }

  /**
   * Actualiza una propiedad existente con nuevos datos.
   * @param id - Identificador único de la propiedad
   * @param data - Nuevos datos parciales de la propiedad
   * @throws Error si la propiedad no se encuentra
   * @returns La propiedad actualizada
   */
  update(id: number, data: Partial<Property>): Property {
    const index = this.properties.findIndex((p) => p.id === id);
    if (index < 0) throw new Error('Property not found');

    const updated = {
      ...this.properties[index],
      ...data,
      updatedAt: new Date(),
    };

    this.properties[index] = updated;
    return updated;
  }

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws Error si la propiedad no se encuentra
   */
  delete(id: number): void {
    const index = this.properties.findIndex((p) => p.id === id);
    if (index < 0) throw new Error('Property not found');
    this.properties.splice(index, 1);
  }
}
