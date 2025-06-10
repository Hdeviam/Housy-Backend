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
import { AuthGuard } from 'src/guards/auth.guard';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Devuelve una lista de todos los usuarios registrados.
   */
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  @UseGuards(AuthGuard)
  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Busca y devuelve un usuario por su ID.
   */
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Crea un nuevo usuario.
   */
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: User })
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  /**
   * Actualiza un usuario existente.
   */
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto): Promise<User> {
    const user = await this.usersService.update(+id, dto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Elimina un usuario por su ID.
   */
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({ name: 'id', example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.remove(+id); // 👈 Llama al método remove() definido
  }
}
