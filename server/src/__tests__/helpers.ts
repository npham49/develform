import { Hono } from 'hono';
import { jest } from '@jest/globals';
import { createMockJwtPayload } from './mocks.js';

// Create test app factory
export const createTestApp = () => {
  const app = new Hono();
  
  // Add test middleware
  app.use('*', (c, next) => {
    // Mock logger to prevent console output during tests
    return next();
  });

  return app;
};

// Mock authentication middleware
export const mockAuthMiddleware = (user?: any) => {
  return jest.fn(async (c, next) => {
    if (user) {
      c.set('jwtPayload', createMockJwtPayload(user));
    } else {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
  });
};

// Mock optional authentication middleware
export const mockOptionalAuthMiddleware = (user?: any) => {
  return jest.fn(async (c, next) => {
    if (user) {
      c.set('jwtPayload', createMockJwtPayload(user));
    } else {
      c.set('jwtPayload', null);
    }
    await next();
  });
};

// Mock form write check middleware
export const mockFormWriteCheckMiddleware = (shouldPass = true) => {
  return jest.fn(async (c, next) => {
    if (!shouldPass) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }
    await next();
  });
};

// Helper to mock request context
export const createMockContext = (options: {
  params?: Record<string, string>;
  body?: any;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  jwtPayload?: any;
} = {}) => {
  const context = {
    req: {
      param: jest.fn((key: string) => options.params?.[key]),
      json: jest.fn(() => Promise.resolve(options.body)),
      header: jest.fn((key: string) => options.headers?.[key]),
    },
    json: jest.fn((data: any, status?: number) => ({
      status: status || 200,
      data,
    })),
    get: jest.fn((key: string) => {
      if (key === 'jwtPayload') return options.jwtPayload;
      return undefined;
    }),
    set: jest.fn(),
  };

  return context;
};

// Helper to test route handlers
export const testRouteHandler = async (
  handler: Function,
  options: {
    params?: Record<string, string>;
    body?: any;
    headers?: Record<string, string>;
    user?: any;
  } = {}
) => {
  const context = createMockContext({
    params: options.params,
    body: options.body,
    headers: options.headers,
    jwtPayload: options.user ? createMockJwtPayload(options.user) : undefined,
  });

  const result = await handler(context);
  return result;
};