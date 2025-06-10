import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

/**
 * DTO para crear un nuevo lead (interés en una propiedad).
 */
export class CreateLeadDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del usuario que muestra interés en la propiedad',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: '456e1234-e89b-12d3-a456-426614174000',
    description: 'UUID de la propiedad por la cual el usuario muestra interés',
  })
  @IsUUID()
  propertyId: string;

  @ApiProperty({
    example: 'Estoy interesado en esta propiedad, ¿aún está disponible?',
    description: 'Mensaje que el usuario envía al mostrar interés',
  })
  @IsString()
  message: string;
}
