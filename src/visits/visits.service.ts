import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from '../entities/visit.entity';
import { NotFoundException } from '@nestjs/common';

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
}
