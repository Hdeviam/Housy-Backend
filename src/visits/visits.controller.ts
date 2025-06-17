import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { VisitsService } from './visits.service';
import { Visit } from './entity/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  /**
   * Obtener todas las visitas del calendario de un usuario.
   * @param userId - UUID del usuario
   * @returns Array de visitas
   */
  @Get(':userId/calendar')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client', 'agent')
  @ApiOperation({ summary: 'Obtener visitas del calendario por usuario' })
  @ApiParam({
    name: 'userId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Calendario obtenido correctamente', type: [Visit] })
  @ApiResponse({ status: 404, description: 'Usuario no tiene visitas' })
  async getCalendarByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Visit[]> {
    return this.visitsService.getCalendarByUser(userId);
  }

  /**
   * Obtener visitas agrupadas por día para el calendario de un usuario.
   * @param userId - UUID del usuario
   * @returns Objeto con fechas como claves y arrays de visitas
   */
  @Get(':userId/calendar/grouped')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client', 'agent')
  @ApiOperation({ summary: 'Obtener visitas agrupadas por día para el calendario de un usuario' })
  @ApiParam({
    name: 'userId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Visitas agrupadas correctamente' })
  async getGroupedCalendarByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Record<string, Visit[]>> {
    const visits = await this.visitsService.getCalendarByUser(userId);
    return this.visitsService.groupVisitsByDay(visits);
  }

  /**
   * Agendar una nueva visita.
   * @param createVisitDto - Datos para crear la visita
   * @returns Visita creada
   */
  @Post()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  @ApiOperation({ summary: 'Agendar una nueva visita' })
  @ApiResponse({ status: 201, description: 'Visita agendada correctamente', type: Visit })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createVisit(@Body() createVisitDto: CreateVisitDto): Promise<Visit> {
    return this.visitsService.createVisit(createVisitDto);
  }

  /**
   * Cancelar una visita existente.
   * @param id - ID numérico de la visita
   * @returns Visita cancelada
   */
  @Patch(':id/cancel')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client', 'agent')
  @ApiOperation({ summary: 'Cancelar una visita' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID numérico de la visita a cancelar',
  })
  @ApiResponse({ status: 200, description: 'Visita cancelada correctamente', type: Visit })
  async cancelVisit(@Param('id') id: number): Promise<Visit> {
    return this.visitsService.cancelVisit(id);
  }

  /**
   * Reprogramar una visita existente.
   * @param id - ID numérico de la visita
   * @param date - Nueva fecha en formato ISO string
   * @returns Visita reprogramada
   */
  @Patch(':id/reschedule')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client', 'agent')
  @ApiOperation({ summary: 'Reprogramar una visita' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID numérico de la visita a reprogramar',
  })
  @ApiResponse({ status: 200, description: 'Visita reprogramada correctamente', type: Visit })
  async rescheduleVisit(@Param('id') id: number, @Body('date') date: string): Promise<Visit> {
    return this.visitsService.rescheduleVisit(id, date);
  }

  /**
   * Obtener todas las visitas agendadas para una propiedad.
   * @param propertyId - UUID de la propiedad
   * @returns Array de visitas
   */
  @Get('property/:propertyId')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client', 'agent')
  @ApiOperation({ summary: 'Obtener visitas por propiedad' })
  @ApiParam({
    name: 'propertyId',
    example: '223e4567-e89b-12d3-a456-426614174000',
    description: 'UUID de la propiedad',
  })
  @ApiResponse({ status: 200, description: 'Visitas encontradas', type: [Visit] })
  @ApiResponse({ status: 404, description: 'No se encontraron visitas para esta propiedad' })
  async getVisitsByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
  ): Promise<Visit[]> {
    return this.visitsService.getVisitsByProperty(propertyId);
  }
}
