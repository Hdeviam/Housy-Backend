import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Property } from '../../properties/entity/property.entity';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.leads)
  user: User;

  @Column({ type: 'uuid', nullable: true }) // 👈 Permite valores null
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
