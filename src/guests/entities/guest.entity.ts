import { BookingEntity } from 'src/bookings/entities/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guests')
export class GuestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  fullName: string;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  nationalID: string;

  @Column({ type: 'text', nullable: false })
  nationality: string;

  @Column({ type: 'text', nullable: false })
  countryFlag: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingEntity, (booking) => booking.guest)
  bookings: BookingEntity[];
}
