import { AppDataSource } from '../config/data-source.js';
import { WeatherRecord } from '../entities/WeatherRecord.js';

const repo = AppDataSource.getRepository(WeatherRecord);

export const createRecord = (rec: Partial<WeatherRecord>) => repo.save(rec);
export const getAllRecords = () => repo.find();
export const getRecordById = (id: string) => repo.findOneBy({ id });
export const updateRecord = (id: string, data: Partial<WeatherRecord>) => repo.update(id, data);
export const deleteRecord = (id: string) => repo.delete(id);
