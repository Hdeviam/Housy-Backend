import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { Property } from '../entities/property.entity';
import { PropertiesService } from './PropertiesService';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

/**
 * Controlador para gestionar operaciones relacionadas con propiedades inmobiliarias.
 * Define rutas REST para crear y recuperar propiedades.
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
}
