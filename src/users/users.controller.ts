import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Devuelve una lista de todos los usuarios registrados.
   * @returns Array de objetos `User`
   */
  @Get()
  async getAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  /**
   * Busca y devuelve un usuario por su ID.
   * @param id - Identificador único del usuario
   * @throws NotFoundException si no se encuentra el usuario
   * @returns Objeto `User`
   */
  @Get(':id')
  async getById(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Crea un nuevo usuario a partir de los datos proporcionados en el cuerpo de la solicitud.
   * @param createUserDto - Datos de la nueva propiedad
   * @returns Objeto `User` creado
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  /**
   * Actualiza un usuario existente con nuevos datos.
   * @param id - Identificador único del usuario
   * @param updateUserDto - Nuevos datos parciales del usuario
   * @throws NotFoundException si no se encuentra el usuario
   * @returns El usuario actualizado
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(+id, updateUserDto);
  }

  /**
   * Elimina un usuario por su ID.
   * @param id - Identificador único del usuario
   * @throws NotFoundException si no se encuentra el usuario
   */
  @Delete(':id')
  delete(@Param('id') id: number): void {
    return this.usersService.remove(+id);
  }
}
