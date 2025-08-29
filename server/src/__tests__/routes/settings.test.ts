import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Hono } from 'hono';
import settingsRoutes from '../../routes/settings.js';
import { createMockDb, mockUser } from '../mocks.js';
import { mockAuthMiddleware } from '../helpers.js';

// Mock dependencies
jest.mock('../../db/index.js', () => ({
  db: createMockDb(),
}));

jest.mock('../../middleware/auth.js', () => ({
  authMiddleware: mockAuthMiddleware(mockUser),
}));

jest.mock('../../services/auth.js', () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('Settings Routes', () => {
  let app: Hono;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = await import('../../services/auth.js');

    // Setup fresh app
    app = new Hono();
    app.route('/api/settings', settingsRoutes);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/settings/profile', () => {
    const mockProfile = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      avatarUrl: mockUser.avatarUrl,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
    };

    it('should return user profile for authenticated user', async () => {
      mockAuthService.getUserProfile.mockResolvedValue([mockProfile]);

      const response = await app.request('/api/settings/profile', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockProfile);
      expect(mockAuthService.getUserProfile).toHaveBeenCalledWith(expect.any(Object), mockUser.id);
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.get('/api/settings/profile', mockUnauth);

      const response = await unauthApp.request('/api/settings/profile', {
        method: 'GET',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when user not found', async () => {
      mockAuthService.getUserProfile.mockResolvedValue([]);

      const response = await app.request('/api/settings/profile', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('User not found');
    });

    it('should return 500 when database error occurs', async () => {
      mockAuthService.getUserProfile.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/settings/profile', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch profile');
    });
  });

  describe('PATCH /api/settings/profile', () => {
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const updatedProfile = {
      ...mockUser,
      ...updateData,
      updatedAt: new Date(),
    };

    it('should update user profile successfully', async () => {
      mockAuthService.updateUserProfile.mockResolvedValue([updatedProfile]);

      const response = await app.request('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(updatedProfile);
      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith(
        expect.any(Object),
        mockUser.id,
        updateData
      );
    });

    it('should update profile with name only', async () => {
      const nameOnlyUpdate = { name: 'New Name Only' };
      const nameOnlyProfile = { ...mockUser, name: nameOnlyUpdate.name };
      
      mockAuthService.updateUserProfile.mockResolvedValue([nameOnlyProfile]);

      const response = await app.request('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(nameOnlyUpdate),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.name).toBe(nameOnlyUpdate.name);
      expect(mockAuthService.updateUserProfile).toHaveBeenCalledWith(
        expect.any(Object),
        mockUser.id,
        nameOnlyUpdate
      );
    });

    it('should return 400 for validation errors - empty name', async () => {
      const invalidData = { name: '' }; // Empty name not allowed

      const response = await app.request('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(invalidData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
      expect(data.errors).toBeDefined();
    });

    it('should return 400 for validation errors - invalid email', async () => {
      const invalidData = { name: 'Valid Name', email: 'invalid-email' };

      const response = await app.request('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(invalidData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
      expect(data.errors).toBeDefined();
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.patch('/api/settings/profile', mockUnauth);

      const response = await unauthApp.request('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 500 when database error occurs', async () => {
      mockAuthService.updateUserProfile.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to update profile');
    });
  });

  describe('DELETE /api/settings/profile', () => {
    it('should delete user account successfully', async () => {
      mockAuthService.deleteUser.mockResolvedValue(undefined);

      const response = await app.request('/api/settings/profile', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('Account deleted successfully');
      expect(mockAuthService.deleteUser).toHaveBeenCalledWith(expect.any(Object), mockUser.id);
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.delete('/api/settings/profile', mockUnauth);

      const response = await unauthApp.request('/api/settings/profile', {
        method: 'DELETE',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 500 when database error occurs', async () => {
      mockAuthService.deleteUser.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/settings/profile', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to delete account');
    });
  });
});