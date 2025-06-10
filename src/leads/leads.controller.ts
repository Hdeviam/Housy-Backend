import { Controller, Post, Body, Get, Param, Delete, NotFoundException } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { Lead } from '../entities/lead.entity';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Leads')
@ApiBearerAuth()
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Crea un nuevo lead.
   */
  @ApiOperation({ summary: 'Crear nuevo lead' })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({ status: 201, description: 'Lead creado', type: Lead })
  //@UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateLeadDto): Promise<Lead> {
    return this.leadsService.create(dto);
  }

  /**
   * Devuelve una lista de todos los leads.
   */
  @ApiOperation({ summary: 'Obtener todos los leads' })
  @ApiResponse({ status: 200, description: 'Lista de leads', type: [Lead] })
  //@UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<Lead[]> {
    return this.leadsService.findAll();
  }

  /**
   * Busca y devuelve un lead por su ID.
   */
  @ApiOperation({ summary: 'Obtener lead por ID' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del lead (número)',
  })
  @ApiResponse({ status: 200, description: 'Lead encontrado', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead no encontrado' })
  //@UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: number): Promise<Lead> {
    const lead = await this.leadsService.findOne(+id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  /**
   * Elimina un lead por su ID.
   */
  @ApiOperation({ summary: 'Eliminar lead' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID del lead (número)',
  })
  @ApiResponse({ status: 200, description: 'Lead eliminado' })
  @ApiResponse({ status: 404, description: 'Lead no encontrado' })
  //@UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const lead = await this.leadsService.findOne(+id);
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    await this.leadsService.remove(+id);
  }
}
