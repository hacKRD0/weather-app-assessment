import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../config/constants.js';
import WeatherService from '../services/weatherService.js';

/**
 * Controller for handling weather-related HTTP requests
 */
class WeatherController {
  /**
   * Get current weather for a location
   * @route GET /weather/current
   */
  public static async getCurrentWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { location, lat, lon } = req.query;

      if (!location && (!lat || !lon)) {
        throw new Error('Location or coordinates are required');
      }

      const latNum = lat ? parseFloat(lat as string) : undefined;
      const lonNum = lon ? parseFloat(lon as string) : undefined;

      const weatherData = latNum !== undefined && lonNum !== undefined
        ? await WeatherService.fetchCurrent('', latNum, lonNum)
        : await WeatherService.fetchCurrent(location as string);
      
      res.json({ success: true, data: weatherData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get weather forecast for a location
   * @route GET /weather/forecast
   */
  public static async getForecast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { location, lat, lon } = req.query;

      if (!location && (!lat || !lon)) {
        throw new Error('Location or coordinates are required');
      }

      const latNum = lat ? parseFloat(lat as string) : undefined;
      const lonNum = lon ? parseFloat(lon as string) : undefined;

      const forecastData = latNum !== undefined && lonNum !== undefined
        ? await WeatherService.fetchForecast('', latNum, lonNum)
        : await WeatherService.fetchForecast(location as string);
      
      res.json({ success: true, data: forecastData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle error responses consistently
   * @param res - Express response object
   * @param error - Error object or message
   */
  private static handleErrorResponse(res: Response, error: unknown): void {
    let statusCode = 500;
    let message = 'Internal server error';
    
    if (error && typeof error === 'object') {
      // Handle status code if it exists
      if ('statusCode' in error && typeof error.statusCode === 'number') {
        statusCode = error.statusCode as number;
      }
      
      // Handle error message if it exists
      if ('message' in error && typeof error.message === 'string') {
        message = error.message as string;
        
        // Map specific error messages to appropriate status codes
        if (message.includes('not found')) {
          statusCode = 404;
        } else if (message.includes('Invalid location') || message.includes('required')) {
          statusCode = 400;
        } else if (message.includes('Rate limit')) {
          statusCode = 429;
        } else if (message.includes('API key')) {
          statusCode = 401;
        }
      }
    }

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

export default WeatherController;
