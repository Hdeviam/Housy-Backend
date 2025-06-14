import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('dashboard')
export class UserDashboardController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Get('admin')
  async adminDashboard() {
    const stats = await this.usersService.getAdminStats();
    return {
      message: 'Bienvenido Administrador',
      stats,
    };
  }

  @Get('agent')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('agent')
  async agentDashboard(@Param('userId') userId: string) {
    const data = await this.usersService.getAgentStats(userId);
    return {
      message: 'Bienvenido Agente',
      ...data,
    };
  }

  @Get('client')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('client')
  async clientDashboard(@Param('userId') userId: string) {
    const data = await this.usersService.getClientStats(userId);
    return {
      message: 'Bienvenido Cliente',
      ...data,
    };
  }
}
