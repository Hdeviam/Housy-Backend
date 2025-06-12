import { IsString, IsNumber, Min, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear una nueva propiedad inmobiliaria.
 */
export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa en Playa' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Casa amplia con jardín y piscina.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 350000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiProperty({ example: 'Madrid, España' })
  @IsString()
  location: string;

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
