import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para solicitar datos de una propiedad a un servicio de IA.
 */
export class EnrichPropertyParamsDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  propertyId: string;
}
