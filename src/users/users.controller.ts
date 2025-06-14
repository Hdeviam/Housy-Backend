/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Property } from 'src/entities/property.entity';
import { Visit } from 'src/entities/visit.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Devuelve una lista de todos los usuarios registrados.
   */
  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async getAll(): Promise<Partial<User>[]> {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Obtiene un usuario por su ID.
   */
  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getById(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Actualiza un usuario existente.
   */
  @Put(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'client')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<Partial<User>> {
    const updatedUser = await this.usersService.update(id, dto);
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }

  /**
   * Elimina un usuario.
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async delete(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.delete(id);
  }

  /**
   * Devuelve todas las propiedades creadas por un usuario.
   */
  @Get(':id/properties')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener propiedades creadas por un usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Lista de propiedades', type: [Property] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o sin propiedades' })
  async getUserProperties(@Param('id') id: string): Promise<Property[]> {
    return this.usersService.findUserProperties(id);
  }

  /**
   * Devuelve la agenda de visitas programadas por o para un usuario.
   */
  @Get(':id/schedule')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener agenda de visitas' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Lista de visitas', type: [Visit] })
  @ApiResponse({ status: 404, description: 'Usuario no tiene visitas' })
  async getUserSchedule(@Param('id') id: string): Promise<Visit[]> {
    return this.usersService.findUserVisits(id);
  }

  /**
   * Devuelve detalles completos del perfil de un usuario.
   */
  @Get(':id/profile')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent', 'client')
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Perfil del usuario', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserProfile(@Param('id') id: string): Promise<Partial<User>> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
