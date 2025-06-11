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

@ApiTags('Users') // Agrupa los endpoints bajo la etiqueta "Users" en Swagger
@ApiBearerAuth() // Indica que los endpoints requieren autenticación por token
@Controller('users') // Ruta base para este controlador: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Inyecta el servicio de usuarios

  // GET /users – Lista todos los usuarios
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  //@UseGuards(AuthGuard) // Opcional: proteger con autenticación
  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // GET /users/:id – Obtener usuario por ID
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard) // Requiere autenticación
  @Get(':id')
  async getById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Lanza error si no existe
    }
    return user;
  }

  // POST /users – Crear nuevo usuario
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiBody({ type: CreateUserDto }) // Documenta el cuerpo esperado
  @ApiResponse({ status: 201, description: 'Usuario creado', type: User })
  //@UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto); // Llama al servicio para crear
  }

  // PUT /users/:id – Actualizar usuario
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  //@UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, dto); // Actualiza y retorna el usuario
  }

  // DELETE /users/:id – Eliminar usuario
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard) // Requiere autenticación
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersService.delete(id);
  }
}
