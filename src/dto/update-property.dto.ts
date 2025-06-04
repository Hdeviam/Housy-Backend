import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar parcialmente una propiedad inmobiliaria.
 * Permite actualizar solo algunos campos sin necesidad de enviar todos.
 */
export class UpdatePropertyDto {
  /**
   * Título actualizado de la propiedad.
   * @example "Casa en el centro"
   */
  @ApiProperty({ example: 'Casa en el centro', required: false })
  title?: string;
  /**
   * Precio actualizado de la propiedad.
   * Debe ser un número positivo.
   */
  @ApiProperty({ example: 375000, required: false })
  price?: number;

  /**
   * Número actualizado de habitaciones.
   * Debe ser un número positivo.
   */
  @ApiProperty({ example: 4, required: false })
  bedrooms?: number;

  /**
   * Número actualizado de baños.
   * Debe ser un número positivo.
   */
  @ApiProperty({ example: 2, required: false })
  bathrooms?: number;

  /**
   * Ubicación actualizada de la propiedad.
   * @example "Madrid, España"
   */
  @ApiProperty({ example: 'Madrid, España', required: false })
  location?: string;
}
