import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EnrichPropertyParamsDto } from 'src/ai-integration/dto/enrichPropertyParams.dto';
import { AiIntegrationService } from './ai-integration.service';
import { EnrichedPropertyResponseDto } from 'src/ai-integration/dto/enrichedPropertyResponse.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('AI Integration')
@ApiBearerAuth()
@Controller('ai-integration')
export class AiIntegrationController {
  constructor(private readonly aiIntegrationService: AiIntegrationService) {}

  /**
   * Endpoint para obtener una ficha enriquecida de una propiedad.
   * Llama al microservicio de IA.
   */
  @Post(':propertyId/enrichPropertyParams')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent') // Solo admin o agentes pueden enriquecer propiedades
  @ApiOperation({ summary: 'Obtener ficha enriquecida de una propiedad' })
  @ApiParam({
    name: 'propertyId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la propiedad a enriquecer',
  })
  @ApiBody({ type: EnrichPropertyParamsDto })
  @ApiResponse({
    status: 200,
    description: 'Ficha enriquecida obtenida correctamente',
    type: EnrichedPropertyResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  async enrichPropertyParams(
    @Param('propertyId') propertyId: string,
  ): Promise<EnrichedPropertyResponseDto> {
    const dto: EnrichPropertyParamsDto = {
      propertyId,
    };
    return this.aiIntegrationService.enrichPropertyParams(dto);
  }
}
