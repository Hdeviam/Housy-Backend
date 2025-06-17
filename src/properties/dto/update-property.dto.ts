import { IsString, IsNumber, Min, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar parcialmente una propiedad inmobiliaria.
 */
export class UpdatePropertyDto {
  @ApiProperty({ example: 'Casa en Playa', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Casa amplia con jardín y piscina.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 375000, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: 'Barcelona, España', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  /**
   * URLs de las fotos de la propiedad (opcional).
   * Pueden ser URLs de imágenes ya cargadas en un servicio como AWS S3.
   */
  @ApiProperty({
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true }) // Cada URL debe ser válida
  photos?: string[];
}
