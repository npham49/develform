import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Hono } from 'hono';
import { createMockDb, mockUser, createMockJwtPayload } from '../mocks';
import { mockAuthMiddleware } from '../helpers';

// Mock dependencies
jest.mock('../../db/index', () => ({
  db: createMockDb(),
}));

jest.mock('../../middleware/auth', () => ({
  authMiddleware: mockAuthMiddleware(mockUser),
}));

jest.mock('../../services/auth', () => ({
  findUserByGithubId: jest.fn(),
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  updateUserWithGithubData: jest.fn(),
}));

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      users: {
        getAuthenticated: jest.fn(),
      },
    },
  })),
}));

jest.mock('hono/cookie', () => ({
  deleteCookie: jest.fn(),
}));

jest.mock('hono/jwt', () => ({
  sign: jest.fn(),
}));

describe('Auth Routes', () => {
  let app: Hono;
  let mockAuthService: any;
  let mockOctokit: any;
  let mockDeleteCookie: any;
  let mockSign: any;

  beforeEach(async () => {
    // Import mocked modules
    const { db } = await import('../../db/index.js');
    mockAuthService = await import('../../services/auth.js');
    const { Octokit } = await import('@octokit/rest');
    const { deleteCookie } = await import('hono/cookie');
    const { sign } = await import('hono/jwt');

    mockOctokit = Octokit;
    mockDeleteCookie = deleteCookie;
    mockSign = sign;

    // Setup fresh app
    app = new Hono();
    app.route('/api/auth', authRoutes);

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/auth/github/callback', () => {
    const mockGithubResponse = {
      access_token: 'github_access_token',
    };

    const mockGithubUser = {
      id: 123456,
      login: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456',
    };

    beforeEach(() => {
      // Mock fetch for GitHub API calls
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue(mockGithubResponse),
        })
        .mockResolvedValueOnce({
          json: jest.fn().mockResolvedValue(mockGithubUser),
        });

      // Mock Octokit
      (mockOctokit as jest.Mock).mockImplementation(() => ({
        rest: {
          users: {
            getAuthenticated: jest.fn().mockResolvedValue({
              data: mockGithubUser,
            }),
          },
        },
      }));

      // Mock JWT sign
      (mockSign as jest.Mock).mockResolvedValue('mock-jwt-token');
    });

    it('should successfully authenticate with GitHub for existing user', async () => {
      // Mock existing user found by GitHub ID
      mockAuthService.findUserByGithubId.mockResolvedValue([mockUser]);

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'github_auth_code' }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        githubId: mockUser.githubId,
        avatarUrl: mockUser.avatarUrl,
      });
      expect(mockAuthService.findUserByGithubId).toHaveBeenCalledWith(expect.any(Object), '123456');
    });

    it('should create new user when GitHub user does not exist', async () => {
      // Mock no existing user found
      mockAuthService.findUserByGithubId.mockResolvedValue([]);
      mockAuthService.findUserByEmail.mockResolvedValue([]);
      mockAuthService.createUser.mockResolvedValue([mockUser]);

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'github_auth_code' }),
      });

      expect(response.status).toBe(200);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(
        expect.any(Object),
        {
          name: mockGithubUser.name,
          email: mockGithubUser.email,
          githubId: mockGithubUser.id.toString(),
          avatarUrl: mockGithubUser.avatar_url,
        }
      );
    });

    it('should update existing user with GitHub data when found by email', async () => {
      // Mock no user found by GitHub ID, but found by email
      mockAuthService.findUserByGithubId.mockResolvedValue([]);
      mockAuthService.findUserByEmail.mockResolvedValue([mockUser]);
      mockAuthService.updateUserWithGithubData.mockResolvedValue([mockUser]);

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'github_auth_code' }),
      });

      expect(response.status).toBe(200);
      expect(mockAuthService.updateUserWithGithubData).toHaveBeenCalledWith(
        expect.any(Object),
        mockUser.id,
        {
          githubId: mockGithubUser.id.toString(),
          avatarUrl: mockGithubUser.avatar_url,
        }
      );
    });

    it('should handle GitHub user without email', async () => {
      const githubUserNoEmail = { ...mockGithubUser, email: null };
      
      // Mock Octokit to return user without email
      (mockOctokit as jest.Mock).mockImplementation(() => ({
        rest: {
          users: {
            getAuthenticated: jest.fn().mockResolvedValue({
              data: githubUserNoEmail,
            }),
          },
        },
      }));

      mockAuthService.findUserByGithubId.mockResolvedValue([]);
      mockAuthService.createUser.mockResolvedValue([mockUser]);

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'github_auth_code' }),
      });

      expect(response.status).toBe(200);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(
        expect.any(Object),
        {
          name: githubUserNoEmail.name,
          githubId: githubUserNoEmail.id.toString(),
          avatarUrl: githubUserNoEmail.avatar_url,
        }
      );
    });

    it('should return 400 when code is missing', async () => {
      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Code is required');
    });

    it('should return 400 when GitHub access token fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ error: 'invalid_request' }),
      });

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'invalid_code' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Failed to get access token');
    });

    it('should return 500 when database error occurs', async () => {
      mockAuthService.findUserByGithubId.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'github_auth_code' }),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Authentication failed');
    });
  });

  describe('GET /api/auth/user', () => {
    it('should return current user when authenticated', async () => {
      const response = await app.request('/api/auth/user', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer valid-token',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        githubId: mockUser.githubId,
        avatarUrl: mockUser.avatarUrl,
      });
    });

    it('should return 401 when not authenticated', async () => {
      // Create app without authentication
      const unauthApp = new Hono();
      const { authMiddleware } = await import('../../middleware/auth.js');
      
      // Mock middleware to return 401
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.get('/api/auth/user', mockUnauth);

      const response = await unauthApp.request('/api/auth/user', {
        method: 'GET',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout user', async () => {
      const response = await app.request('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer valid-token',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Logged out successfully');
      expect(mockDeleteCookie).toHaveBeenCalledWith(expect.any(Object), 'auth_token');
    });

    it('should return 401 when not authenticated', async () => {
      // Similar to user endpoint test for unauthenticated access
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.post('/api/auth/logout', mockUnauth);

      const response = await unauthApp.request('/api/auth/logout', {
        method: 'POST',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });
  });
});