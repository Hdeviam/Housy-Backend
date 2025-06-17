import { IsUUID, IsDateString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVisitDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '223e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ example: '2025-07-01T10:00:00Z', description: 'Fecha de la visita' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] })
  @IsIn(['scheduled', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'scheduled' | 'completed' | 'cancelled';
}
