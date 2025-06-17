import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entity/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  /**
   * Crea un nuevo lead a partir de datos proporcionados.
   * @param createLeadDto - Datos iniciales del lead
   * @returns El lead creado
   */
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(createLeadDto);
    return await this.leadRepository.save(lead);
  }

  /**
   * Obtiene todos los leads registrados.
   * @returns Array de objetos `Lead`
   */
  async findAll(): Promise<Lead[]> {
    return this.leadRepository.find();
  }

  /**
   * Busca un lead por su ID.
   * @param id - Identificador único del lead
   * @throws NotFoundException si no se encuentra el lead
   * @returns Objeto `Lead`
   */
  async findOne(id: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  /**
   * Elimina un lead por su ID.
   * @param id - Identificador único del lead
   * @throws NotFoundException si no se encuentra el lead
   */
  async remove(id: number): Promise<void> {
    const result = await this.leadRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
  }
}
