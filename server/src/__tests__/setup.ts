import { jest } from '@jest/globals';

// Set up environment variables for testing
process.env.JWT_SECRET = 'test-secret-key';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.GITHUB_CLIENT_ID = 'test-client-id';
process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock fetch for external API calls with proper typing
(global as any).fetch = jest.fn();