import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  admin = 'admin',
  agent = 'agent',
  client = 'client',
}

/**
 * DTO para actualizar un usuario existente.
 */
export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Jane Smith', required: false })
  @IsString()
  name?: string;

  @ApiProperty({ example: 'NewPassword123!', required: false })
  @IsString()
  password?: string;

  @ApiProperty({
    example: 'agent',
    enum: ['admin', 'agent', 'client'],
    required: false,
  })
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ example: '+34 600 123 456', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
