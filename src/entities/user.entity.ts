/**
 * Entidad que representa un usuario del sistema Housy.
 * Define los campos básicos necesarios para almacenar información sobre usuarios,
 * incluyendo roles y fechas de creación y actualización.
 */
export class User {
  /**
   * Identificador único del usuario (opcional mientras no se conecte a base de datos).
   */
  id?: number;

  /**
   * Correo electrónico del usuario. Debe ser único.
   * @example "usuario@example.com"
   */
  email: string;

  /**
   * Nombre completo del usuario.
   * @example "John Doe"
   */
  name: string;

  /**
   * Rol del usuario en el sistema.
   * Puede ser 'admin', 'agent' o 'client'.
   */
  role: 'admin' | 'agent' | 'client';

  /**
   * Fecha de creación del usuario.
   * Se asigna automáticamente al crear un nuevo usuario.
   */
  createdAt?: Date;

  /**
   * Última fecha de actualización del usuario.
   * Se actualiza automáticamente cada vez que se modifica el registro.
   */
  updatedAt?: Date;
}
