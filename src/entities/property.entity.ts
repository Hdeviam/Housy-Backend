import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lead } from './lead.entity';
import { EnrichedPropertyParams } from './enrichedPropertyParams.entity';

@Entity()
export class Property {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  location: string;

  @Column('simple-array', { nullable: true }) // 👈 Guarda array como texto
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Todos los leads generados por esta propiedad.
   */
  @OneToMany(() => Lead, (lead) => lead.property)
  leads: Lead[]; // 👈 Aquí es donde falta el campo

  @OneToMany(
    () => EnrichedPropertyParams,
    (enrichedPropertyParams) => enrichedPropertyParams.property,
  )
  enrichedPropertyParams: EnrichedPropertyParams[];
}
