import { BookingEntity } from '@/bookings/entities/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  GUEST = 'guest',
}

export enum UserProvider {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: true })
  password?: string;

  @Column({ type: 'text', nullable: true })
  nationalID?: string;

  @Column({ type: 'text', nullable: true })
  nationality?: string;

  @Column({ type: 'text', nullable: true })
  countryFlag?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.CREDENTIALS,
  })
  provider: UserProvider;

  @Column({ type: 'jsonb', nullable: true })
  avatar?: { url: string; public_id: string };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingEntity, (booking) => booking.user)
  bookings: BookingEntity[];
}
