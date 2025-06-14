import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Visit } from '../entities/visit.entity';
import { VisitsService } from './visits.service';

@ApiTags('Visits')
@ApiBearerAuth()
@Controller('visits')
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin', 'client', 'agent')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  /**
   * Devuelve todas las visitas programadas por usuario.
   */
  @Get(':userId/calendar')
  @ApiOperation({ summary: 'Obtener visitas del calendario por usuario' })
  @ApiParam({
    name: 'userId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Calendario obtenido correctamente', type: [Visit] })
  @ApiResponse({ status: 404, description: 'Usuario no tiene visitas' })
  async getCalendarByUser(@Param('userId') userId: string): Promise<Visit[]> {
    return this.visitsService.getCalendarByUser(userId);
  }

  /**
   * Devuelve visitas agrupadas por día para el calendario de un usuario.
   */
  @Get(':userId/calendar/grouped')
  @ApiOperation({ summary: 'Obtener visitas agrupadas por día' })
  @ApiParam({
    name: 'userId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Visitas agrupadas correctamente' })
  async getGroupedCalendarByUser(
    @Param('userId') userId: string,
  ): Promise<Record<string, Visit[]>> {
    const visits = await this.visitsService.getCalendarByUser(userId);
    return this.visitsService.groupVisitsByDay(visits);
  }
}
