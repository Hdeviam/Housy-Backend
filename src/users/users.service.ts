import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Property } from 'src/entities/property.entity';
import { Visit } from 'src/entities/visit.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,

    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  /**
   * Obtener todos los usuarios.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Buscar un usuario por ID.
   */
  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Actualizar un usuario.
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  /**
   * Eliminar un usuario.
   */
  async delete(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Obtener propiedades creadas por el usuario.
   */
  async findUserProperties(userId: string): Promise<Property[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .relation('properties')
      .of(userId)
      .loadMany();
  }

  /**
   * Obtener visitas asociadas al usuario.
   */
  async findUserVisits(userId: string): Promise<Visit[]> {
    return this.userRepository.createQueryBuilder('user').relation('visits').of(userId).loadMany();
  }

  /**
   * Estadísticas para rol admin.
   */
  async getAdminStats() {
    const totalProperties = await this.propertyRepository.count();
    const totalUsers = await this.userRepository.count();
    const totalVisits = await this.visitRepository.count();

    return {
      totalProperties,
      totalUsers,
      totalVisits,
    };
  }

  /**
   * Estadísticas para agentes.
   */
  async getAgentStats(userId: string) {
    const properties = await this.propertyRepository.find({ where: { userId } });
    const visits = await this.visitRepository.find({ where: { userId } });

    return {
      propertiesCount: properties.length,
      upcomingVisits: visits.filter((v) => v.status === 'scheduled'),
    };
  }

  /**
   * Estadísticas para clientes.
   */
  async getClientStats(userId: string) {
    const properties = await this.propertyRepository.find({ where: { userId } });
    const visits = await this.visitRepository.find({ where: { userId } });

    return {
      savedProperties: properties,
      upcomingAppointments: visits.filter((v) => v.date > new Date()),
    };
  }
}
