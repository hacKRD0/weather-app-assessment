import { Router, type Request, type Response, type NextFunction } from 'express';
import WeatherController from '../controllers/weatherController.js';
import { errorHandler } from '../middleware/errorHandler.js';

const router = Router();

/**
 * @route   GET /current
 * @desc    Get current weather for a location
 * @access  Public
 * @param   {string} location - City name, zip code, or coordinates (lat,lon)
 * @returns {Object} Weather data for the specified location
 */
router.post('/current', (req: Request, res: Response, next: NextFunction) => 
  WeatherController.getCurrentWeather(req, res, next)
);

/**
 * @route   GET /forecast
 * @desc    Get weather forecast for a location
 * @access  Public
 * @param   {string} location - City name, zip code, or coordinates (lat,lon)
 * @returns {Array} Weather forecast data for the specified location
 */
router.post('/forecast', (req: Request, res: Response, next: NextFunction) => 
  WeatherController.getForecast(req, res, next)
);

// Use the error handler middleware
router.use(errorHandler);

export default router;
