import { BookingEntity } from 'src/bookings/entities/booking.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cabins')
export class CabinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'int2', nullable: false })
  maxCapacity: number;

  @Column({ type: 'int2', nullable: false })
  regularPrice: number;

  @Column({ type: 'float4', default: 0 })
  discount: number = 0;

  @Column({ type: 'jsonb', nullable: false })
  image: { url: string; public_id: string };

  @Column({ type: 'text', nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingEntity, (booking) => booking.cabin)
  bookings: BookingEntity[];
}
