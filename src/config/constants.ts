// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  TIMEOUT: 10000, // 10 seconds
} as const;

// Default values
export const DEFAULT_VALUES = {
  UNITS: 'metric' as const,
  LANG: 'en' as const,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  LOCATION_OR_COORDS_REQUIRED: 'Please provide either a location (city name or zip code) or both latitude and longitude coordinates',
  INVALID_LOCATION: 'Please provide a valid location (city name, zip code, or coordinates)',
  SERVICE_UNAVAILABLE: 'Weather service is currently unavailable',
  LOCATION_NOT_FOUND: 'Location not found',
  ENDPOINT_NOT_FOUND: 'Endpoint not found',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
  MISSING_API_KEY: 'API key is required but was not provided',
} as const;

export type WeatherUnits = typeof DEFAULT_VALUES.UNITS;
export type WeatherLanguage = typeof DEFAULT_VALUES.LANG;

// Type for the weather data response
export interface WeatherApiResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
  sys: {
    country: string;
  };
  name: string;
  dt: number;
}
