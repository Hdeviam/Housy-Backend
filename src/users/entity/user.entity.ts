import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lead } from '../../leads/entity/lead.entity';
import { Property } from '../../properties/entity/property.entity';
import { Visit } from '../../visits/entity/visit.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ select: false }) // 👈 No se selecciona automáticamente
  password: string;

  @Column()
  role: 'admin' | 'agent' | 'client';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  phone?: string;

  /**
   * Todos los leads generados por este usuario.
   */
  @OneToMany(() => Lead, (lead) => lead.user)
  leads: Lead[];

  /**
   * Todas las propiedades creadas por este usuario.
   */
  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  /**
   * Todas las visitas programadas por o para este usuario.
   */
  @OneToMany(() => Visit, (visit) => visit.user)
  visits: Visit[];
}
