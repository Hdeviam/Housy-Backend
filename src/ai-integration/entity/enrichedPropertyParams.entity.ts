import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Property } from '../../properties/entity/property.entity';

@Entity()
export class EnrichedPropertyParams {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.enrichedPropertyParams)
  property: Property;

  @Column({ type: 'uuid' })
  propertyId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  priceEstimate: number;

  @Column('simple-array', { nullable: true }) // 👈 Guarda array como texto
  recommendedPhotos: string[];

  @Column()
  qualityOfLifeScore: string;

  @Column()
  locationDetails: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
