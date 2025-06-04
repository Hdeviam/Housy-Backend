import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users') // Agrupa los endpoints bajo "Users"
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Devuelve una lista de todos los usuarios registrados.
   * @returns Array de objetos `User`
   */
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @Get()
  getAll(): User[] {
    return this.usersService.findAll();
  }

  /**
   * Busca y devuelve un usuario por su ID.
   * @param id - Identificador único del usuario
   * @throws NotFoundException si no se encuentra el usuario
   * @returns Objeto `User`
   */
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  getById(@Param('id') id: number): User {
    return this.usersService.findOne(+id);
  }

  /**
   * Crea un nuevo usuario a partir de los datos proporcionados en el cuerpo de la solicitud.
   * @param createUserDto - Datos de la nueva propiedad
   * @returns Objeto `User` creado
   */
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  /**
   * Elimina un usuario por su ID.
   * @param id - Identificador único del usuario
   * @throws NotFoundException si no se encuentra el usuario
   */
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  delete(@Param('id') id: number): void {
    this.usersService.remove(+id);
  }
}
