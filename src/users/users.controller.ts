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
  @Roles('admin', 'client', 'agent')
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
   * Crea un nuevo usuario.
   */
  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: User })
  async create(@Body() dto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.create(dto);
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
  //@UseGuards(AuthGuard, RoleGuard)
  //@Roles()
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
}
