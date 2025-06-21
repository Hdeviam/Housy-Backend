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
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entity/property.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { PropertiesService } from './PropertiesService';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  /**
   * Devuelve una lista de todas las propiedades registradas.
   * @returns Array de objetos `Property`
   */
  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener todas las propiedades' })
  @ApiResponse({ status: 200, description: 'Lista de propiedades', type: [Property] })
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener propiedad por ID' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la propiedad',
  })
  @ApiResponse({ status: 200, description: 'Propiedad encontrada', type: Property })
  @ApiResponse({ status: 404, description: 'Propiedad no encontrada' })
  async getById(@Param('id') id: number): Promise<Property> {
    const property = await this.propertiesService.findOne(id);
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent') // 👈 Solo agentes o admins pueden crear propiedades
  @ApiOperation({ summary: 'Crear una nueva propiedad' })
  @ApiBody({ type: CreatePropertyDto }) // Documenta el cuerpo esperado
  @ApiResponse({ status: 201, description: 'Propiedad creada', type: Property })
  @ApiResponse({ status: 403, description: 'Acceso denegado por falta de permisos' })
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
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent') // 👈 Solo agentes o admins pueden actualizar propiedades
  @ApiOperation({ summary: 'Actualizar propiedad' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la propiedad',
  })
  @ApiBody({ type: UpdatePropertyDto }) // Documenta el cuerpo esperado
  @ApiResponse({ status: 200, description: 'Propiedad actualizada', type: Property })
  @ApiResponse({ status: 404, description: 'Propiedad no encontrada' })
  @ApiResponse({ status: 403, description: 'Acceso denegado por falta de permisos' })
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  /**
   * Elimina una propiedad por su ID.
   * @param id - Identificador único de la propiedad
   * @throws NotFoundException si no se encuentra la propiedad
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent') // 👈 Solo admins pueden eliminar propiedades
  @ApiOperation({ summary: 'Eliminar propiedad' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la propiedad',
  })
  @ApiResponse({ status: 200, description: 'Propiedad eliminada' })
  @ApiResponse({ status: 404, description: 'Propiedad no encontrada' })
  @ApiResponse({ status: 403, description: 'Acceso denegado por falta de permisos' })
  async delete(@Param('id') id: number): Promise<void> {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    await this.propertiesService.remove(id);
  }

  /**
   * Busca propiedades por ubicación o título (búsqueda parcial).
   * @param query - Término de búsqueda
   * @returns Array de propiedades coincidentes
   */
  @Get('search')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client') // 👈 Todos los roles pueden buscar propiedades
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
