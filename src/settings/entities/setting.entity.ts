import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int2', nullable: false })
  minBookingLength: number;

  @Column({ type: 'int2', nullable: false })
  maxBookingLength: number;

  @Column({ type: 'int2', nullable: false })
  maxGuestsPerBooking: number;

  @Column({ type: 'float4', nullable: false })
  breakfastPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
