import { ApiProperty } from '@nestjs/swagger';
export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa en Playa' })
  title: string;

  @ApiProperty({ example: 'Casa amplia con jardín y piscina.' })
  description: string;

  @ApiProperty({ example: 350000 })
  price: number;

  @ApiProperty({ example: 3 })
  bedrooms: number;

  @ApiProperty({ example: 2 })
  bathrooms: number;

  @ApiProperty({ example: 'Madrid, España' })
  location: string;
}
