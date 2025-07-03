import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ERROR_MESSAGES } from '../config/constants.js';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  errors?: Record<string, unknown>;
  value?: unknown;
  keyValue?: Record<string, unknown>;
}

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Default error response
  const error: CustomError = { ...err };
  error.message = err.message;

  // Handle specific error types
  
  // Handle CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${String(err.value) || 'unknown'}`;
    error.message = message;
    error.statusCode = 404;
  }

  // Handle duplicate key errors (e.g., unique constraint violation)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error.message = message;
    error.statusCode = 400;
  }

  // Handle validation errors
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors)
      .map((val: unknown) => 
        typeof val === 'object' && val !== null && 'message' in val 
          ? String((val as { message: unknown }).message)
          : 'Validation error'
      )
      .join(', ');
    error.message = messages || 'Validation failed';
    error.statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again!';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Your token has expired! Please log in again.';
    error.statusCode = 401;
  }

  // Handle rate limit exceeded
  if (err.statusCode === 429) {
    error.message = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
  }

  // Handle missing or invalid API key
  if (err.message.includes('API key') || err.message.includes('API_KEY')) {
    error.message = ERROR_MESSAGES.INVALID_API_KEY;
    error.statusCode = error.statusCode || 401;
  }

  // Send response
  const statusCode = error.statusCode || 500;
  const response: Record<string, unknown> = {
    success: false,
    error: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler middleware
 */
export const notFoundHandler = (
  _req: Request, 
  _res: Response, 
  next: NextFunction
): void => {
  const error = new Error(ERROR_MESSAGES.ENDPOINT_NOT_FOUND);
  (error as CustomError).statusCode = 404;
  next(error);
};
