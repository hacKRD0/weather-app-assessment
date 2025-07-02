import { Request, Response } from 'express';

/**
 * @description Health check controller to verify the server is running
 */
class HealthController {
  /**
   * @route GET /health
   * @description Health check endpoint
   * @access Public
   */
  public static getHealth(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}

export default HealthController;
