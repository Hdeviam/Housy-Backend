import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Property } from 'src/entities/property.entity';
import { Visit } from 'src/entities/visit.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Devuelve todos los usuarios desde la base de datos
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Busca un usuario por ID
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Actualiza un usuario, y si viene una nueva contraseña, también la hashea
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10); // Hashea la nueva contraseña si existe
    }

    Object.assign(user, dto); // Actualiza las propiedades del usuario
    return this.userRepository.save(user); // Guarda los cambios
  }

  // Elimina un usuario por ID
  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Devuelve todas las propiedades creadas por un usuario.
   */
  async findUserProperties(userId: string): Promise<Property[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .relation('properties')
      .of(userId)
      .loadMany();
  }

  /**
   * Devuelve todas las visitas asociadas a un usuario.
   */
  async findUserVisits(userId: string): Promise<Visit[]> {
    return this.userRepository.createQueryBuilder('user').relation('visits').of(userId).loadMany();
  }
}
