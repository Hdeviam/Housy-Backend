import { IsEmail, IsString, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  admin = 'admin',
  agent = 'agent',
  client = 'client',
}

/**
 * DTO para registro de usuarios.
 */
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido.' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres.' })
  name: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @ApiProperty({
    example: 'client',
    enum: ['admin', 'agent', 'client'],
    description: 'Rol del usuario',
  })
  @IsEnum(UserRole, { message: 'Rol no válido. Debe ser "admin", "agent" o "client".' })
  role?: UserRole;
}
