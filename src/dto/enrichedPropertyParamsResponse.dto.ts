import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para respuesta del servicio de IA.
 */
export class EnrichedPropertyParamsResponseDto {
  @ApiProperty({ example: 'Casa en Playa', description: 'Título enriquecido' })
  title: string;

  @ApiProperty({
    example: 'Casa amplia con jardín y piscina.',
    description: 'Descripción enriquecida',
  })
  description: string;

  @ApiProperty({ example: 375000, description: 'Precio estimado' })
  priceEstimate: number;

  @ApiProperty({ example: ['https://example.com/photo1.jpg'], description: 'Fotos recomendadas' })
  recommendedPhotos: string[];

  @ApiProperty({ example: 'High', description: 'Calidad de vida cercano' })
  qualityOfLifeScore: string;

  @ApiProperty({ example: 'Barcelona, España', description: 'Ubicación mejorada' })
  locationDetails: string;
}
