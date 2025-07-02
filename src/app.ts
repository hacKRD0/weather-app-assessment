import express, { type Express, type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { createServer, type Server as HttpServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import weatherRoutes from './routes/weatherRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

class App {
  public app: Express;
  public server: HttpServer;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.server = createServer(this.app);
    this.port = port;

    this.initializeMiddlewares();
    this.initializeErrorHandling();

  }

  private initializeMiddlewares(): void {
    // Enable CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) 
        : '*',
      credentials: true
    }));

    // Security headers
    this.app.use(helmet());

    // Parse JSON request body
    this.app.use(express.json());

    // Parse URL-encoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // Initialize routes
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/weather', weatherRoutes);

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      const clientPath = path.join(__dirname, '../../client/dist');
      this.app.use(express.static(clientPath));
      this.app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(clientPath, 'index.html'));
      });
    }

    // 404 handler
    this.app.use(notFoundHandler);

    // Error handler must be the last middleware
    this.app.use(errorHandler);
  }

  private initializeErrorHandling(): void {
    // No need to call errorHandler here, it's already added as a middleware in setupRoutes
  }

  public listen(callback?: () => void): void {
    this.server.listen(this.port, () => {
      console.log(`\n      =================================\n      🚀 Server running on port ${this.port} 🚀\n      =================================\n      Environment: ${process.env.NODE_ENV || 'development'}\n      Time: ${new Date().toISOString()}\n      `);
      
      if (callback) callback();
    });
    
    // Handle server shutdown gracefully
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }
  
  private gracefulShutdown(): void {
    console.log('Shutting down gracefully...');
    
    // No WebSocket connections to close
    
    // Close the HTTP server
    if (this.server) {
      this.server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    }
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }
}

// Start the server
const PORT = parseInt(process.env.PORT || '3000', 10);
const app = new App(PORT);
app.listen();

export default app;
