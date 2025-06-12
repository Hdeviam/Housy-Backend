import {
  Controller,
  Post,
  Body,
  Get,
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
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { PropertiesService } from './PropertiesService';

@ApiTags('Properties') // Agrupa los endpoints bajo la etiqueta "Properties"
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Devuelve una lista de todas las propiedades registradas.
   * @returns Array de objetos `Property`
   */
  @Get()
  @UseGuards(AuthGuard)
  async getAll(): Promise<Property[]> {
    return this.propertiesService.findAll();
  }

  /**
   * Busca y devuelve una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   * @returns Objeto `Property`
   */
  @Get(':id')
  //@UseGuards(AuthGuard)
  async getById(@Param('id') id: number): Promise<Property> {
    const property = await this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  /**
   * Crea una nueva propiedad a partir de los datos proporcionados.
   * @param createPropertyDto - Datos iniciales de la propiedad
   * @returns La propiedad creada
   */
  @Post()
  //@UseGuards(AuthGuard)
  async create(@Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertiesService.create(createPropertyDto);
  }

  /**
   * Actualiza una propiedad existente con nuevos datos.
   * @param id - Identificador único de la propiedad
   * @param updatePropertyDto - Nuevos datos parciales de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   * @returns La propiedad actualizada
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number): Promise<void> {
    const property = await this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    await this.propertiesService.remove(+id);
  }

  /**
   * Busca propiedades por ubicación o título (búsqueda parcial).
   * @param query - Término de búsqueda
   * @returns Array de propiedades coincidentes
   */
  @Get('search')
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'query',
    example: 'Playa',
    description: 'Término de búsqueda (ubicación o título)',
  })
  @ApiOperation({ summary: 'Buscar propiedades por ubicación o título' })
  @ApiResponse({
    status: 200,
    description: 'Lista de propiedades coincidentes',
    type: [Property],
  })
  async search(@Query('query') query: string): Promise<Property[]> {
    return this.propertiesService.search(query);
  }
}
