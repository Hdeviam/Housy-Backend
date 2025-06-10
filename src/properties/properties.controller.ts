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

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Devuelve una lista de todas las propiedades registradas.
   */
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las propiedades',
    type: [Property],
  })
  @Get()
  async getAll(): Promise<Property[]> {
    return this.propertiesService.findAll();
  }

  /**
   * Busca y devuelve una propiedad por su ID.
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
  async getById(@Param('id') id: number): Promise<Property> {
    const property = await this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  /**
   * Crea una nueva propiedad a partir de los datos proporcionados.
   */
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiBearerAuth()
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
  async create(@Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(createPropertyDto);
  }

  /**
   * Actualiza una propiedad existente con nuevos datos.
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
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  /**
   * Elimina una propiedad por su ID.
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
  async delete(@Param('id') id: number): Promise<void> {
    const property = await this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    await this.propertiesService.remove(+id);
  }

  /**
   * Busca propiedades por ubicación o título (búsqueda parcial).
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
  async search(@Query('query') query: string): Promise<Property[]> {
    return this.propertiesService.search(query);
  }
}
