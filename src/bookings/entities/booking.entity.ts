import { CabinEntity } from 'src/cabins/entities/cabin.entity';
import { GuestEntity } from 'src/guests/entities/guest.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatus {
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
  UNCONFIRMED = 'unconfirmed',
}

@Entity('bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;

  @Column({ type: 'int2', nullable: false })
  numNights: number;

  @Column({ type: 'int2', nullable: false })
  numGuests: number;

  @Column({ type: 'float4' })
  cabinPrice: number;

  @Column({ type: 'float4' })
  extrasPrice: number;

  @Column({ type: 'float4' })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.UNCONFIRMED,
  })
  status: BookingStatus;

  @Column({ type: 'boolean', default: false })
  hasBreakfast: boolean;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @ManyToOne(() => CabinEntity, (cabin) => cabin.bookings, {
    onDelete: 'CASCADE',
  })
  cabin: CabinEntity;

  @ManyToOne(() => GuestEntity, (guest) => guest.bookings, {
    onDelete: 'CASCADE',
  })
  guest: GuestEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
