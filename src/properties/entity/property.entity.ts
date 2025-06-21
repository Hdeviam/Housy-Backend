import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from '../../leads/entity/lead.entity';
import { EnrichedPropertyParams } from '../../ai-integration/entity/enrichedPropertyParams.entity';
import { User } from '../../users/entity/user.entity';

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

  @Column('simple-array', { nullable: true })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lead, (lead) => lead.property)
  leads: Lead[];

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  status?: string;

  @OneToMany(() => EnrichedPropertyParams, (params) => params.property)
  enrichedPropertyParams: EnrichedPropertyParams[];

  // 👇 Relación con usuario opcional
  @ManyToOne(() => User, (user) => user.properties, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // 👇 userId también debe ser nullable
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
}
