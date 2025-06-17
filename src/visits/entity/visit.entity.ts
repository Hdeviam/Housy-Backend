/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Property } from '../../properties/entity/property.entity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({ type: 'text' })
  status: 'scheduled' | 'completed' | 'cancelled';

  @ManyToOne(() => Property, (property) => property.visits)
  property: Property;

  @Column({ type: 'uuid' })
  propertyId: string;

  @ManyToOne(() => User, (user) => user.visits)
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
