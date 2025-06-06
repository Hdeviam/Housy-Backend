import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad User para almacenar información de usuarios en PostgreSQL.
 * Define los campos básicos necesarios para gestionar usuarios en el sistema Housy.
 */
@Entity()
export class User {
  /**
   * Identificador único del usuario, generado automáticamente por la base de datos.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Correo electrónico del usuario. Debe ser único.
   * @example "usuario@example.com"
   */
  @Column({ unique: true })
  email: string;

  /**
   * Nombre completo del usuario.
   * @example "John Doe"
   */
  @Column()
  name: string;

  /**
   * Contraseña del usuario, guardada en formato seguro.
   */
  @Column()
  password: string;

  /**
   * Rol del usuario en el sistema.
   * Puede ser 'admin', 'agent' o 'client'.
   */
  @Column()
  role: 'admin' | 'agent' | 'client';

  /**
   * Fecha de creación del registro del usuario.
   * Se asigna automáticamente al crear un nuevo usuario.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Última fecha de actualización del usuario.
   * Se actualiza automáticamente cada vez que se modifica el registro.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
