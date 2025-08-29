import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Hono } from 'hono';
import versionRoutes from '../../routes/versions.js';
import { createMockDb, mockUser, mockFormVersion } from '../mocks.js';
import { mockAuthMiddleware, mockFormWriteCheckMiddleware } from '../helpers.js';

// Mock dependencies
jest.mock('../../db/index.js', () => ({
  db: createMockDb(),
}));

jest.mock('../../middleware/auth.js', () => ({
  authMiddleware: mockAuthMiddleware(mockUser),
}));

jest.mock('../../middleware/role.js', () => ({
  formWriteCheckMiddleware: mockFormWriteCheckMiddleware(true),
}));

jest.mock('../../services/versions.js', () => ({
  getFormVersions: jest.fn(),
  getVersionBySha: jest.fn(),
  createVersion: jest.fn(),
  updateVersion: jest.fn(),
  makeVersionLatest: jest.fn(),
}));

describe('Version Routes', () => {
  let app: Hono;
  let mockVersionsService: any;

  beforeEach(async () => {
    mockVersionsService = await import('../../services/versions.js');

    // Setup fresh app
    app = new Hono();
    app.route('/api', versionRoutes);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/forms/:formId/versions', () => {
    it('should return all versions for a form', async () => {
      const mockVersions = [
        mockFormVersion,
        { ...mockFormVersion, id: 2, versionSha: 'def456', description: 'Second version' },
      ];
      mockVersionsService.getFormVersions.mockResolvedValue(mockVersions);

      const response = await app.request('/api/forms/1/versions', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockVersions);
      expect(mockVersionsService.getFormVersions).toHaveBeenCalledWith(expect.any(Object), 1);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/versions', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.get('/api/forms/:formId/versions', mockUnauth);

      const response = await unauthApp.request('/api/forms/1/versions', {
        method: 'GET',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when form not found or access denied', async () => {
      const noAccessApp = new Hono();
      const mockNoAccess = jest.fn(async (c) => {
        return c.json({ error: 'Form not found or access denied' }, 404);
      });
      
      noAccessApp.get('/api/forms/:formId/versions', mockNoAccess);

      const response = await noAccessApp.request('/api/forms/999/versions', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found or access denied');
    });

    it('should return 500 when database error occurs', async () => {
      mockVersionsService.getFormVersions.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1/versions', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch form versions');
    });
  });

  describe('GET /api/forms/:formId/versions/:sha', () => {
    it('should return specific version by SHA', async () => {
      mockVersionsService.getVersionBySha.mockResolvedValue([mockFormVersion]);

      const response = await app.request('/api/forms/1/versions/abc123', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockFormVersion);
      expect(mockVersionsService.getVersionBySha).toHaveBeenCalledWith(expect.any(Object), 1, 'abc123');
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/versions/abc123', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 400 when version SHA is missing', async () => {
      const response = await app.request('/api/forms/1/versions/', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Version SHA is required');
    });

    it('should return 404 when version not found', async () => {
      mockVersionsService.getVersionBySha.mockResolvedValue([]);

      const response = await app.request('/api/forms/1/versions/nonexistent', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Version not found');
    });

    it('should return 500 when database error occurs', async () => {
      mockVersionsService.getVersionBySha.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1/versions/abc123', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch form version');
    });
  });

  describe('POST /api/forms/:formId/versions', () => {
    const newVersionData = {
      description: 'New version',
      schema: { components: [{ type: 'text', label: 'Name' }] },
      publish: false,
      baseVersionSha: 'abc123',
    };

    it('should create new version successfully', async () => {
      const createdVersion = { ...mockFormVersion, ...newVersionData, versionSha: 'new123' };
      mockVersionsService.createVersion.mockResolvedValue(createdVersion);

      const response = await app.request('/api/forms/1/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newVersionData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data).toEqual(createdVersion);
      expect(data.message).toBe('Version created successfully');
      expect(mockVersionsService.createVersion).toHaveBeenCalledWith(
        expect.any(Object),
        1,
        mockUser.id,
        newVersionData
      );
    });

    it('should create version with minimal data', async () => {
      const minimalData = {};
      const createdVersion = { ...mockFormVersion, versionSha: 'minimal123' };
      mockVersionsService.createVersion.mockResolvedValue(createdVersion);

      const response = await app.request('/api/forms/1/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(minimalData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data).toEqual(createdVersion);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newVersionData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.post('/api/forms/:formId/versions', mockUnauth);

      const response = await unauthApp.request('/api/forms/1/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVersionData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when form not found or access denied', async () => {
      const noAccessApp = new Hono();
      const mockNoAccess = jest.fn(async (c) => {
        return c.json({ error: 'Form not found or access denied' }, 404);
      });
      
      noAccessApp.post('/api/forms/:formId/versions', mockNoAccess);

      const response = await noAccessApp.request('/api/forms/999/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newVersionData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found or access denied');
    });

    it('should return 500 when database error occurs', async () => {
      mockVersionsService.createVersion.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newVersionData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create version');
    });
  });

  describe('PATCH /api/forms/:formId/versions/:sha', () => {
    const updateData = {
      description: 'Updated version',
      schema: { components: [{ type: 'email', label: 'Email' }] },
    };

    it('should update version successfully', async () => {
      const updatedVersion = { ...mockFormVersion, ...updateData };
      mockVersionsService.updateVersion.mockResolvedValue(updatedVersion);

      const response = await app.request('/api/forms/1/versions/abc123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(updatedVersion);
      expect(data.message).toBe('Version updated successfully');
      expect(mockVersionsService.updateVersion).toHaveBeenCalledWith(
        expect.any(Object),
        1,
        'abc123',
        mockUser.id,
        updateData
      );
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/versions/abc123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 400 when version SHA is missing', async () => {
      const response = await app.request('/api/forms/1/versions/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Version SHA is required');
    });

    it('should return 500 when database error occurs', async () => {
      mockVersionsService.updateVersion.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1/versions/abc123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to update version');
    });
  });

  describe('POST /api/forms/:formId/versions/:sha/revert', () => {
    const revertData = {
      description: 'Reverted to previous version',
    };

    it('should revert to specific version successfully', async () => {
      const newVersion = { ...mockFormVersion, versionSha: 'revert123', description: revertData.description };
      mockVersionsService.makeVersionLatest.mockResolvedValue(newVersion);

      const response = await app.request('/api/forms/1/versions/abc123/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(revertData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(newVersion);
      expect(data.message).toBe('Successfully created new draft version');
      expect(mockVersionsService.makeVersionLatest).toHaveBeenCalledWith(
        expect.any(Object),
        1,
        'abc123',
        mockUser.id,
        revertData.description
      );
    });

    it('should revert with optional description', async () => {
      const newVersion = { ...mockFormVersion, versionSha: 'revert456' };
      mockVersionsService.makeVersionLatest.mockResolvedValue(newVersion);

      const response = await app.request('/api/forms/1/versions/abc123/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify({}),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(newVersion);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/versions/abc123/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(revertData),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.post('/api/forms/:formId/versions/:sha/revert', mockUnauth);

      const response = await unauthApp.request('/api/forms/1/versions/abc123/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revertData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when form not found or access denied', async () => {
      const noAccessApp = new Hono();
      const mockNoAccess = jest.fn(async (c) => {
        return c.json({ error: 'Form not found or access denied' }, 404);
      });
      
      noAccessApp.post('/api/forms/:formId/versions/:sha/revert', mockNoAccess);

      const response = await noAccessApp.request('/api/forms/999/versions/abc123/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(revertData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found or access denied');
    });

    it('should return 500 when database error occurs', async () => {
      mockVersionsService.makeVersionLatest.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1/versions/abc123/revert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(revertData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to make version latest');
    });
  });
});