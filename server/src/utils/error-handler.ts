import { Context } from 'hono';
import { z } from 'zod';

/**
 * Centralized error handling utilities to eliminate redundant error handling patterns.
 * Provides consistent error responses and logging across all routes.
 */

export interface ErrorResponse {
  error: string;
  errors?: unknown[];
  status?: number;
}

/**
 * Handles Zod validation errors with consistent format
 */
export const handleValidationError = (error: z.ZodError): ErrorResponse => ({
  error: 'Validation failed',
  errors: error.issues,
  status: 400,
});

/**
 * Handles generic errors with proper logging and response
 */
export const handleGenericError = (error: unknown, operation: string): ErrorResponse => {
  console.error(`Error in ${operation}:`, error);

  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    };
  }

  return {
    error: `Failed to ${operation}`,
    status: 500,
  };
};

/**
 * Async route wrapper that handles errors consistently
 */
export const asyncHandler = (fn: (c: Context) => Promise<Response>, operation: string) => {
  return async (c: Context): Promise<Response> => {
    try {
      return await fn(c);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { error: message, errors } = handleValidationError(error);
        return c.json({ error: message, errors }, 400);
      }

      const { error: message } = handleGenericError(error, operation);
      return c.json({ error: message }, 500);
    }
  };
};

/**
 * Validates request body with consistent error handling
 */
export const validateBody = async <T>(c: Context, schema: z.ZodSchema<T>): Promise<T> => {
  const body = await c.req.json();
  return schema.parse(body);
};

/**
 * Validates numeric parameter with proper error handling
 */
export const validateNumericParam = (param: string, paramName: string): number => {
  const value = parseInt(param);
  if (isNaN(value)) {
    throw new Error(`Invalid ${paramName}: must be a number`);
  }
  return value;
};

/**
 * Standard success response format
 */
export const successResponse = <T>(data: T, status = 200) => ({
  data,
  status,
});

/**
 * Standard error response format
 */
export const errorResponse = (error: string, status = 500) => ({
  error,
  status,
});
