import { beforeEach, describe, expect, it } from '@jest/globals';
import { Hono } from 'hono';
import { mockUser } from '../mocks';
import { TestResponse } from '../types';

// Create test app with mocked routes
const createTestAuthApp = () => {
  const app = new Hono();

  // Mock GitHub OAuth initiation
  app.get('/github', async (c) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return c.json({ error: 'GitHub OAuth not configured' }, 500);
    }

    const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/github/callback');
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

    return c.redirect(githubUrl);
  });

  // Mock GitHub OAuth callback
  app.get('/github/callback', async (c) => {
    const code = c.req.query('code');
    const error = c.req.query('error');

    if (error || !code) {
      return c.json({ error: 'Authorization failed' }, 400);
    }

    // Mock successful auth flow
    const mockToken = 'mock-github-token';
    const mockGithubUser = {
      id: 123456,
      login: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://avatars.githubusercontent.com/u/123456',
    };

    // Mock user creation/update
    const user = mockUser;
    const jwtToken = 'mock-jwt-token';

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        githubId: user.githubId,
        avatarUrl: user.avatarUrl,
      },
      token: jwtToken,
    });
  });

  // Mock user profile endpoint
  app.get('/me', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        githubId: mockUser.githubId,
        avatarUrl: mockUser.avatarUrl,
      },
    });
  });

  // Mock logout endpoint
  app.post('/logout', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ message: 'Logged out successfully' });
  });

  return app;
};

describe('Auth Routes', () => {
  let app: Hono;

  beforeEach(() => {
    app = createTestAuthApp();
  });

  describe('GET /github', () => {
    it('should redirect to GitHub OAuth when client ID is configured', async () => {
      process.env.GITHUB_CLIENT_ID = 'test-client-id';

      const res = await app.request('/github');
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('github.com/login/oauth/authorize');
    });

    it('should return error when GitHub OAuth is not configured', async () => {
      delete process.env.GITHUB_CLIENT_ID;

      const res = await app.request('/github');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(500);
      expect(data.error).toBe('GitHub OAuth not configured');
    });
  });

  describe('GET /github/callback', () => {
    beforeEach(() => {
      process.env.GITHUB_CLIENT_ID = 'test-client-id';
      process.env.GITHUB_CLIENT_SECRET = 'test-client-secret';
    });

    it('should handle successful OAuth callback', async () => {
      const res = await app.request('/github/callback?code=test-code');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('should handle OAuth error', async () => {
      const res = await app.request('/github/callback?error=access_denied');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Authorization failed');
    });

    it('should handle missing authorization code', async () => {
      const res = await app.request('/github/callback');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Authorization failed');
    });
  });

  describe('GET /me', () => {
    it('should return user profile when authenticated', async () => {
      const res = await app.request('/me', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        githubId: mockUser.githubId,
        avatarUrl: mockUser.avatarUrl,
      });
    });

    it('should return unauthorized when not authenticated', async () => {
      const res = await app.request('/me');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /logout', () => {
    it('should logout successfully when authenticated', async () => {
      const res = await app.request('/logout', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.message).toBe('Logged out successfully');
    });

    it('should return unauthorized when not authenticated', async () => {
      const res = await app.request('/logout', { method: 'POST' });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  // Edge cases and additional scenarios
  describe('Edge Cases', () => {
    it('should handle malformed authorization header', async () => {
      const res = await app.request('/me', {
        headers: { Authorization: 'InvalidFormat' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle empty authorization header', async () => {
      const res = await app.request('/me', {
        headers: { Authorization: '' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should handle authorization header without Bearer prefix', async () => {
      const res = await app.request('/me', {
        headers: { Authorization: 'just-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
