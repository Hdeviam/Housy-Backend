import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from './entity/visit.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitRepository: Repository<Visit>,
  ) {}

  async getCalendarByUser(userId: string): Promise<Visit[]> {
    const visits = await this.visitRepository.find({
      where: { userId },
      relations: ['property'],
    });

    if (!visits.length) {
      throw new NotFoundException(`No se encontraron visitas para el usuario ${userId}`);
    }

    return visits;
  }

  // Opcional: Agrupar por días
  groupVisitsByDay(visits: Visit[]): Record<string, Visit[]> {
    const grouped: Record<string, Visit[]> = {};

    for (const visit of visits) {
      const day = visit.date.toISOString().split('T')[0]; // Ej: "2025-06-14"
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(visit);
    }

    return grouped;
  }

  async createVisit(dto: CreateVisitDto): Promise<Visit> {
    const visit = this.visitRepository.create({
      ...dto,
      status: dto.status ?? 'scheduled',
    });

    return await this.visitRepository.save(visit);
  }

  async cancelVisit(id: number): Promise<Visit> {
    const visit = await this.visitRepository.findOneBy({ id });
    if (!visit) throw new NotFoundException('Visita no encontrada');
    visit.status = 'cancelled';
    return await this.visitRepository.save(visit);
  }

  async rescheduleVisit(id: number, newDate: string): Promise<Visit> {
    const visit = await this.visitRepository.findOneBy({ id });
    if (!visit) throw new NotFoundException('Visita no encontrada');
    visit.date = new Date(newDate);
    return await this.visitRepository.save(visit);
  }

  async getVisitsByProperty(propertyId: string): Promise<Visit[]> {
    const visits = await this.visitRepository.find({
      where: { propertyId },
      relations: ['user'], // Opcional: incluir datos del usuario que hizo la visita
      order: { date: 'ASC' }, // Opcional: orden por fecha
    });

    if (!visits.length) {
      throw new NotFoundException(`No se encontraron visitas para la propiedad ${propertyId}`);
    }

    return visits;
  }
}
