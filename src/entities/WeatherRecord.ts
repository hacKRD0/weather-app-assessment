// src/entities/WeatherRecord.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WeatherRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: 100 })
  location!: string;

  @Column('date')
  date!: string; // YYYY-MM-DD

  @Column('decimal', { precision: 5, scale: 2 })
  temperature!: number;

  @Column('varchar', { length: 100, nullable: true })
  description?: string;
}