import { format, formatDate } from 'date-fns/format';
import { API_CONFIG, DEFAULT_VALUES, ERROR_MESSAGES } from '../config/constants.js';
import { createRecord } from '../repositories/weatherRecordRepo.js';
import { isValidLocation } from '../utils/validators.js';
import dotenv from 'dotenv';

dotenv.config();

interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface OpenWeatherWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface OpenWeatherSys {
  country: string;
}

interface OpenWeatherCity {
  name: string;
  country: string;
}

interface OpenWeatherResponse {
  dt: number
  main: OpenWeatherMain;
  weather: OpenWeatherWeather[];
  sys: OpenWeatherSys;
  name: string;
  cod: number;
  message?: string;
}

interface OpenWeatherForecastResponse extends Omit<OpenWeatherResponse, 'weather'> {
  list: Array<Omit<OpenWeatherResponse, 'sys' | 'name'>>;
  city: OpenWeatherCity;
  cnt: number;
}

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  country: string;
}

const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';

export default class WeatherService {
  private static readonly baseUrl = API_CONFIG.BASE_URL;
  private static readonly apiKey = process.env.OPENWEATHER_API_KEY;


  /**
   * Fetches current weather data for a location
   * @param location - City name, zip code, or coordinates (lat,lon)
   * @returns Promise with weather data
   */
  private static async getCoordinates(location: string): Promise<{ lat: number; lon: number; name?: string; country?: string }> {
    if (!this.apiKey) throw new Error(ERROR_MESSAGES.MISSING_API_KEY);

    // Decide whether to treat as zip/post code (starts with digit) or city name
    const isZip = /^\d/.test(location.trim());
    const endpoint = isZip ? `${GEO_BASE_URL}/zip?zip=${encodeURIComponent(location)}`
                           : `${GEO_BASE_URL}/direct?q=${encodeURIComponent(location)}&limit=1`;

    const res = await fetch(`${endpoint}&appid=${this.apiKey}`, {
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    });

    if (!res.ok) {
      throw new Error(`Geocoding error ${res.status}`);
    }

    const data = await res.json() as any;

    if (isZip) {
      if (!data || typeof data !== 'object' || data.lat === undefined) {
        throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
      }
      return { lat: data.lat, lon: data.lon, name: data.name, country: data.country };
    }

    // direct returns array
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(ERROR_MESSAGES.LOCATION_NOT_FOUND);
    }
    const first = data[0];
    return { lat: first.lat, lon: first.lon, name: first.name, country: first.country };
  }

  static async fetchCurrent(location: string, lat?: number, lon?: number): Promise<WeatherData> {
    try {
      if (!this.apiKey) {
        throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
      }

      let finalLat = lat;
      let finalLon = lon;
      let name: string | undefined;
      let country: string | undefined;

      if (lat === undefined || lon === undefined) {
        if (!isValidLocation(location)) {
          throw new Error(ERROR_MESSAGES.INVALID_LOCATION);
        }
        const coords = await this.getCoordinates(location);
        finalLat = coords.lat;
        finalLon = coords.lon;
        name = coords.name;
        country = coords.country;
      }

      if (finalLat === undefined || finalLon === undefined) {
        throw new Error(ERROR_MESSAGES.INVALID_LOCATION);
      }

      const params = new URLSearchParams({
        lat: String(finalLat),
        lon: String(finalLon),
        appid: this.apiKey,
        units: DEFAULT_VALUES.UNITS,
        lang: DEFAULT_VALUES.LANG,
      });

      const response = await fetch(`${this.baseUrl}/weather?${params}`, {
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        const error = await response.json() as Record<string, any>;
        throw new Error(error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as Record<string, any>;

      const rec = await createRecord({
        location,
        date: format(new Date(data.dt * 1000), 'yyyy-MM-dd'),
        temperature: data.main.temp,
        description: data.weather?.[0]?.description,
      });

      return this.mapWeatherData(data, { name, country });
    } catch (error: unknown) {
      console.error('WeatherService error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.SERVICE_UNAVAILABLE);
    }
  }

  /**
   * Fetches weather forecast for a location
   * @param location - City name, zip code, or coordinates (lat,lon)
   * @returns Promise with forecast data
   */
  static async fetchForecast(location: string, lat?: number, lon?: number): Promise<WeatherData[]> {
    try {
      if (!this.apiKey) {
        throw new Error(ERROR_MESSAGES.MISSING_API_KEY);
      }

      let finalLat = lat;
      let finalLon = lon;
      let name: string | undefined;
      let country: string | undefined;

      if (lat === undefined || lon === undefined) {
        if (!isValidLocation(location)) {
          throw new Error(ERROR_MESSAGES.INVALID_LOCATION);
        }
        const coords = await this.getCoordinates(location);
        finalLat = coords.lat;
        finalLon = coords.lon;
        name = coords.name;
        country = coords.country;
      }

      if (finalLat === undefined || finalLon === undefined) {
        throw new Error(ERROR_MESSAGES.INVALID_LOCATION);
      }

      const params = new URLSearchParams({
        lat: String(finalLat),
        lon: String(finalLon),
        appid: this.apiKey,
        units: DEFAULT_VALUES.UNITS,
        lang: DEFAULT_VALUES.LANG,
      });

      const response = await fetch(`${this.baseUrl}/forecast?${params}`, {
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        const error = await response.json() as Record<string, any>;
        throw new Error(error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as OpenWeatherForecastResponse;
      const records = [];
      data.list.forEach(item => {
        records.push(createRecord({
          location,
          date: format(new Date(item.dt * 1000), 'yyyy-MM-dd'),
          temperature: item.main.temp,
          description: item.weather?.[0]?.description,
        }));
      })
      return data.list.map(item => this.mapWeatherData(item, { 
        name: name || data.city?.name, 
        country: country || data.city?.country 
      }));
    } catch (error: unknown) {
      console.error('ForecastService error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.SERVICE_UNAVAILABLE);
    }
  }

  private static mapWeatherData(data: Record<string, any>, cityData?: { name?: string; country?: string } | OpenWeatherCity): WeatherData {
    if (!data || !data.main || !data.weather || !Array.isArray(data.weather) || data.weather.length === 0) {
      throw new Error('Invalid weather data received from API');
    }
    
    const main = data.main;
    const weather = data.weather[0];
    
    return {
      temp: main.temp,
      feels_like: main.feels_like,
      temp_min: main.temp_min,
      temp_max: main.temp_max,
      pressure: main.pressure,
      humidity: main.humidity,
      description: weather.description,
      icon: weather.icon,
      city: cityData?.name || data.name || 'Unknown City',
      country: cityData?.country || data.sys?.country || '',
    };
  }


}
