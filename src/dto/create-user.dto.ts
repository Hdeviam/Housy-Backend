import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum } from 'class-validator';

export enum UserRole {
  admin = 'admin',
  agent = 'agent',
  client = 'client',
}

/**
 * DTO para crear un nuevo usuario.
 * Define los campos obligatorios necesarios para el registro de usuarios.
 */
export class CreateUserDto {
  /**
   * Correo electrónico del usuario. Debe ser único.
   * @example "user@example.com"
   */
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  /**
   * Nombre completo del usuario.
   * @example "John Doe"
   */
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  /**
   * Rol del usuario en la aplicación.
   * Valores permitidos: 'admin', 'agent', 'client'.
   * @example "client"
   */
  @ApiProperty({
    example: 'client',
    enum: ['admin', 'agent', 'client'],
  })
  @IsEnum(UserRole)
  role: UserRole;
}
