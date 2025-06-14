import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Property } from './property.entity';
import { SectionType } from '../dto/upload-photo.dto'; // Usamos el mismo enum

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: SectionType,
  })
  section: SectionType;

  @ManyToOne(() => Property, (property) => property.photos, { onDelete: 'CASCADE' })
  property: Property;

  @Column({ type: 'uuid' })
  propertyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
