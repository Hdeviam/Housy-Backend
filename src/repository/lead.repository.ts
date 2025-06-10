/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Lead } from 'src/entities/lead.entity';

/**
 * Clase temporal que simula una capa de acceso a datos para entidades de tipo Lead.
 * Se usará únicamente para desarrollo local hasta que se integre con una base de datos real.
 */
export class LeadRepository {
  private leads: Lead[] = [];

  /**
   * Obtiene todas las propiedades almacenadas en memoria.
   * @returns Array de objetos Lead
   */
  findAll(): Lead[] {
    return this.leads;
  }

  /**
   * Busca un lead por su ID.
   * @param id - Identificador único del lead
   * @returns Objeto Lead si existe, undefined si no
   */
  findOne(id: number): Lead | undefined {
    return this.leads.find((lead) => lead.id === id);
  }

  /**
   * Crea un nuevo lead a partir de los datos proporcionados.
   * Asigna un ID temporal aleatorio y registra fechas de creación y actualización.
   * @param dto - Datos iniciales del lead (solo userId, propertyId y message)
   * @param userEntity - Entidad de usuario asociada al lead
   * @param propertyEntity - Entidad de propiedad asociada al lead
   * @returns El lead creado
   */
  create(dto: Partial<Lead>, userEntity: any, propertyEntity: any): Lead {
    const newLead: Lead = {
      id: Math.floor(Math.random() * 1_000_000_000),
      user: userEntity, // 👈 Debe ser un objeto User, no undefined
      userId: dto.userId || '',
      property: propertyEntity, // 👈 Debe ser un objeto Property, no undefined
      propertyId: dto.propertyId || '',
      message: dto.message || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.leads.push(newLead);
    return newLead;
  }

  /**
   * Elimina un lead por su ID.
   * @param id - Identificador único del lead
   * @throws Error si el lead no se encuentra
   * @returns true si se eliminó correctamente
   */
  remove(id: number): boolean {
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index < 0) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    this.leads.splice(index, 1);
    return true;
  }

  /**
   * Actualiza un lead existente con nuevos datos.
   * @param id - Identificador único del lead
   * @param data - Nuevos datos parciales del lead
   * @throws Error si el lead no se encuentra
   * @returns El lead actualizado
   */
  update(id: number, data: Partial<Lead>): Lead {
    const index = this.leads.findIndex((lead) => lead.id === id);
    if (index < 0) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const updated = {
      ...this.leads[index],
      ...data,
      updatedAt: new Date(),
    };

    this.leads[index] = updated;
    return updated;
  }
}
