/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Property } from './property.entity';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.leads, { nullable: true })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => Property, (property) => property.leads)
  property: Property;

  @Column({ type: 'uuid' })
  propertyId: string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
