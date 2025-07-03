import { RequestHandler } from 'express';
import * as Repo from '../repositories/weatherRecordRepo.js';
import * as RecordSvc from '../services/recordService.js';

export const createRecords: RequestHandler = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.body;
    const records = await RecordSvc.createWeatherRecords(location, startDate, endDate);
    res.status(201).json(records);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const readAll: RequestHandler = async (_req, res) => {
  const records = await Repo.getAllRecords();
  res.json(records);
};

export const readOne: RequestHandler = async (req, res) => {
  const rec = await Repo.getRecordById(req.params.id);
  if (!rec) {
    res.status(404).send();
  }
  res.json(rec);
};

export const updateOne: RequestHandler = async (req, res) => {
  await Repo.updateRecord(req.params.id, req.body);
  res.sendStatus(204);
};

export const deleteOne: RequestHandler = async (req, res) => {
  await Repo.deleteRecord(req.params.id);
  res.sendStatus(204);
};
