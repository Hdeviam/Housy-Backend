import { Repository } from 'typeorm';
import { Visit } from '../entity/visit.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VisitRepository extends Repository<Visit> {
  // Ejemplo: obtener visitas por usuario ordenadas por fecha
  async findByUserOrdered(userId: string): Promise<Visit[]> {
    return this.find({
      where: { userId },
      order: { date: 'ASC' },
      relations: ['property'],
    });
  }

  // Ejemplo: verificar si ya existe una visita para ese día y propiedad
  async hasConflict(propertyId: string, date: Date): Promise<boolean> {
    const existing = await this.findOne({
      where: { propertyId, date },
    });
    return !!existing;
  }

  // Ejemplo: agrupadas por día
  async findGroupedByDay(userId: string): Promise<Record<string, Visit[]>> {
    const visits = await this.findByUserOrdered(userId);

    return visits.reduce(
      (acc, visit) => {
        const key = visit.date.toISOString().split('T')[0];
        if (!acc[key]) acc[key] = [];
        acc[key].push(visit);
        return acc;
      },
      {} as Record<string, Visit[]>,
    );
  }
}
