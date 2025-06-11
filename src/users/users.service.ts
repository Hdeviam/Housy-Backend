import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; // Importa bcrypt para hashear contraseñas
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable() // Marca esta clase como inyectable en el sistema de dependencias
export class UsersService {
  constructor(
    @InjectRepository(User) // Inyecta el repositorio de la entidad User
    private readonly userRepository: Repository<User>,
  ) {}

  // Devuelve todos los usuarios desde la base de datos
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Busca un usuario por ID
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Crea un nuevo usuario y hashea su contraseña
  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10); // Hashea la contraseña con un salt de 10
    const newUser = this.userRepository.create({ ...dto, password: hashedPassword }); // Crea instancia de usuario
    return this.userRepository.save(newUser); // Guarda en la base de datos
  }

  // Actualiza un usuario, y si viene una nueva contraseña, también la hashea
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`); // Lanza excepción si no existe
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10); // Hashea la nueva contraseña si existe
    }

    Object.assign(user, dto); // Actualiza las propiedades del usuario
    return this.userRepository.save(user); // Guarda los cambios
  }

  // Elimina un usuario por ID
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
