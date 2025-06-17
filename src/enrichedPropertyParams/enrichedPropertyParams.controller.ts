import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { EnrichedPropertyParamsService } from './enrichedPropertyParams.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { EnrichPropertyParamsDto } from 'src/ai-integration/dto/enrichPropertyParams.dto';
import { EnrichedPropertyParamsResponseDto } from 'src/ai-integration/dto/enrichedPropertyParamsResponse.dto';

@ApiTags('EnrichedPropertyParams')
@Controller('enrichedPropertyParams')
export class EnrichedPropertyParamsController {
  constructor(private readonly enrichedPropertyParamsService: EnrichedPropertyParamsService) {}

  /**
   * Endpoint para obtener una ficha enriquecida de una propiedad.
   * Llama al microservicio de IA y guarda resultados en DB.
   */
  @Post(':propertyId/enrichPropertyParams')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener y guardar ficha enriquecida de una propiedad' })
  @ApiParam({
    name: 'propertyId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la propiedad a enriquecer',
  })
  @ApiBody({ type: EnrichPropertyParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Ficha enriquecida obtenida y guardada correctamente',
    type: EnrichedPropertyParamsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  async enrichPropertyParams(
    @Param('propertyId') propertyId: string,
  ): Promise<EnrichedPropertyParamsResponseDto> {
    const dto: EnrichPropertyParamsDto = {
      propertyId,
    };
    return this.enrichedPropertyParamsService.enrichPropertyParams(dto);
  }

  /**
   * Endpoint para obtener una ficha enriquecida previamente guardada.
   */
  @Get(':propertyId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Obtener ficha enriquecida guardada de una propiedad' })
  @ApiParam({
    name: 'propertyId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la propiedad cuya ficha se quiere obtener',
  })
  @ApiResponse({
    status: 200,
    description: 'Ficha enriquecida obtenida correctamente',
    type: EnrichedPropertyParamsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ficha enriquecida no encontrada',
  })
  async getEnrichedPropertyParams(
    @Param('propertyId') propertyId: string,
  ): Promise<EnrichedPropertyParamsResponseDto> {
    return this.enrichedPropertyParamsService.getEnrichedPropertyParams(propertyId);
  }
}
