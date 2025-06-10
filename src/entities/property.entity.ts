import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Property para representar propiedades en el sistema Housy.
 * Incluye información básica como título, descripción, ubicación y precio.
 */
@Entity()
export class Property {
  /**
   * Identificador único de la propiedad.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Título de la propiedad.
   * @example "Apartamento moderno en el centro"
   */
  @Column()
  title: string;

  /**
   * Descripción detallada de la propiedad.
   * @example "Este apartamento cuenta con cocina equipada, balcón y excelente vista."
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Precio de la propiedad en la moneda local.
   * @example 250000
   */
  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  /**
   * Número de habitaciones.
   * @example 3
   */
  @Column()
  bedrooms: number;

  /**
   * Número de baños.
   * @example 2
   */
  @Column()
  bathrooms: number;

  /**
   * Ubicación de la propiedad.
   * @example "Bogotá, Colombia"
   */
  @Column()
  location: string;

  /**
   * Fecha de creación del registro de la propiedad.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha de última actualización del registro.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
