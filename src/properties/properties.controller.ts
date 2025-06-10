import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { Property } from '../entities/property.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { PropertiesService } from './PropertiesService';

/**
 * Controlador para gestionar operaciones relacionadas con propiedades inmobiliarias.
 * Define rutas REST para crear, leer, actualizar y eliminar propiedades.
 */
@ApiTags('Properties') // Agrupa los endpoints bajo la etiqueta "Properties"
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Devuelve una lista de todas las propiedades registradas.
   * @returns Array de objetos `Property`
   */
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las propiedades',
    type: [Property],
  })
  @Get()
  getAll(): Property[] {
    return this.propertiesService.findAll();
  }

  /**
   * Busca y devuelve una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   * @returns Objeto `Property`
   */
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la propiedad' })
  @ApiResponse({
    status: 200,
    description: 'Propiedad encontrada',
    type: Property,
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  @Get(':id')
  getById(@Param('id') id: number): Property {
    const property = this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  /**
   * Crea una nueva propiedad a partir de los datos proporcionados en el cuerpo de la solicitud.
   * @param createPropertyDto - Datos de la nueva propiedad
   * @returns Objeto `Property` creado
   */
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiBearerAuth() // 👈 Indica que requiere autenticación
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({
    status: 201,
    description: 'Propiedad creada exitosamente',
    type: Property,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto): Property {
    return this.propertiesService.create(createPropertyDto);
  }

  /**
   * Actualiza una propiedad existente con nuevos datos.
   * @param id - Identificador único de la propiedad
   * @param updatePropertyDto - Nuevos datos parciales de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   * @returns La propiedad actualizada
   */
  @ApiOperation({ summary: 'Actualizar una propiedad' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la propiedad' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({
    status: 200,
    description: 'Propiedad actualizada exitosamente',
    type: Property,
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  @Put(':id')
  update(@Param('id') id: number, @Body() updatePropertyDto: UpdatePropertyDto): Property {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  @ApiOperation({ summary: 'Eliminar una propiedad' })
  @ApiParam({ name: 'id', example: 1, description: 'ID de la propiedad' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Propiedad eliminada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Propiedad no encontrada',
  })
  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.propertiesService.remove(+id);
  }

  /**
   * Busca propiedades por ubicación o título (búsqueda parcial).
   * @param query - Término de búsqueda
   * @returns Array de propiedades coincidentes
   */
  @ApiOperation({ summary: 'Buscar propiedades por ubicación o título' })
  @ApiQuery({
    name: 'query',
    example: 'Madrid',
    description: 'Término de búsqueda (ubicación o título)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propiedades coincidentes',
    type: [Property],
  })
  @Get('search')
  search(@Query('query') query: string): Property[] {
    return this.propertiesService.search(query);
  }
}
