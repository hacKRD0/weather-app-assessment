import { createRecord } from '../repositories/weatherRecordRepo.js';
import { isValidLocation } from '../utils/validators.js';

const ONE_CALL = 'https://api.openweathermap.org/data/2.5/onecall';
const HISTORY = 'https://api.openweathermap.org/data/2.5/history/city';
const GEO_DIRECT = 'http://api.openweathermap.org/geo/1.0/direct';
const GEO_ZIP = 'http://api.openweathermap.org/geo/1.0/zip';
const MIN_DATE = new Date('1979-01-01');

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function geocode(location: string): Promise<{ lat: number; lon: number }> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) throw new Error('Missing API key');

  let res: Response;
  if (/^\d/.test(location.trim())) {
    // treat as zip
    res = await fetch(`${GEO_ZIP}?zip=${location}&appid=${key}`);
    if (!res.ok) throw new Error('Location not found');
    const data = (await res.json()) as any;
    return { lat: data.lat, lon: data.lon };
  }
  res = await fetch(`${GEO_DIRECT}?q=${encodeURIComponent(location)}&limit=1&appid=${key}`);
  if (!res.ok) throw new Error('Location not found');
  const arr = (await res.json()) as any[];
  if (!arr.length) throw new Error('Location not found');
  return { lat: arr[0].lat, lon: arr[0].lon };
}

export async function createWeatherRecords(location: string, startDate: string, endDate: string) {
  if (!isValidLocation(location)) throw new Error('Invalid location');

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end || start < MIN_DATE || end < MIN_DATE) {
    throw new Error('Invalid date range');
  }

  const { lat, lon } = await geocode(location);
  const startUnix = Math.floor(start.getTime() / 1000);
  const endUnix = Math.floor(end.getTime() / 1000);
  const key = process.env.OPENWEATHER_API_KEY;
  const paramsBase = `lat=${lat}&lon=${lon}&type=hour&start=${startUnix}&end=${endUnix}&appid=${key}&units=metric`;

  const res = await fetch(`${HISTORY}?${paramsBase}`);
  if (!res.ok) {
    console.log('Weather API error', res);
    throw new Error('Weather API error');
  }
  const data = (await res.json()) as any;
  const records = [];
  for (const day of data.daily) {
    const date = formatDate(new Date(day.dt * 1000));
    if (date < startDate || date > endDate) continue;
    const rec = await createRecord({
      location,
      date,
      temperature: day.temp.day,
      description: day.weather?.[0]?.description,
    });
    records.push(rec);
  }
  return records;
}
