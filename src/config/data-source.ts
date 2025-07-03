import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { WeatherRecord } from '../entities/WeatherRecord.js';

/*
 * SQLite database is stored in the project root by default. For demos / local runs
 * this keeps the stack simple & self-contained without requiring a separate DB server.
 */
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_FILE || 'weather.sqlite',
  // Ensure migrations / schema are created automatically in dev
  synchronize: true,
  logging: false,
  entities: [WeatherRecord],
});
