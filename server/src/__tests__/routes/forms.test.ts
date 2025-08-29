import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Hono } from 'hono';
import formRoutes from '../../routes/forms.js';
import { createMockDb, mockUser, mockForm } from '../mocks.js';
import { mockAuthMiddleware, mockOptionalAuthMiddleware, mockFormWriteCheckMiddleware } from '../helpers.js';

// Mock dependencies
jest.mock('../../db/index.js', () => ({
  db: createMockDb(),
}));

jest.mock('../../middleware/auth.js', () => ({
  authMiddleware: mockAuthMiddleware(mockUser),
  optionalAuthMiddleware: mockOptionalAuthMiddleware(mockUser),
}));

jest.mock('../../middleware/role.js', () => ({
  formWriteCheckMiddleware: mockFormWriteCheckMiddleware(true),
}));

jest.mock('../../services/forms.js', () => ({
  getUserForms: jest.fn(),
  getFormByIdForPublic: jest.fn(),
  getFormSchemaById: jest.fn(),
  createForm: jest.fn(),
  updateForm: jest.fn(),
  getFormByIdAndOwner: jest.fn(),
}));

describe('Forms Routes', () => {
  let app: Hono;
  let mockFormsService: any;

  beforeEach(async () => {
    mockFormsService = await import('../../services/forms.js');

    // Setup fresh app
    app = new Hono();
    app.route('/api/forms', formRoutes);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/forms', () => {
    it('should return all forms for authenticated user', async () => {
      const mockForms = [mockForm, { ...mockForm, id: 2, name: 'Form 2' }];
      mockFormsService.getUserForms.mockResolvedValue(mockForms);

      const response = await app.request('/api/forms', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockForms);
      expect(mockFormsService.getUserForms).toHaveBeenCalledWith(expect.any(Object), mockUser.id);
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.get('/api/forms', mockUnauth);

      const response = await unauthApp.request('/api/forms', {
        method: 'GET',
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 500 when database error occurs', async () => {
      mockFormsService.getUserForms.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch forms');
    });
  });

  describe('GET /api/forms/:id', () => {
    it('should return public form for authenticated user', async () => {
      mockFormsService.getFormByIdForPublic.mockResolvedValue([mockForm]);

      const response = await app.request('/api/forms/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockForm);
      expect(mockFormsService.getFormByIdForPublic).toHaveBeenCalledWith(expect.any(Object), 1, mockUser.id);
    });

    it('should return public form for anonymous user', async () => {
      // Mock optional auth middleware without user
      const anonApp = new Hono();
      const { optionalAuthMiddleware } = await import('../../middleware/auth.js');
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.get('/api/forms/:id', mockAnonAuth, async (c) => {
        const formId = parseInt(c.req.param('id'));
        const form = await mockFormsService.getFormByIdForPublic(null, formId, null);
        return c.json({ data: form[0] });
      });

      mockFormsService.getFormByIdForPublic.mockResolvedValue([mockForm]);

      const response = await anonApp.request('/api/forms/1', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockForm);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 404 when form not found', async () => {
      mockFormsService.getFormByIdForPublic.mockResolvedValue([]);

      const response = await app.request('/api/forms/999', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found');
    });

    it('should return 500 when database error occurs', async () => {
      mockFormsService.getFormByIdForPublic.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch form');
    });
  });

  describe('GET /api/forms/:id/schema', () => {
    const mockSchema = { components: [{ type: 'text', label: 'Name' }] };

    it('should return form schema for authenticated user', async () => {
      mockFormsService.getFormSchemaById.mockResolvedValue([{ schema: mockSchema }]);

      const response = await app.request('/api/forms/1/schema', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockSchema);
      expect(mockFormsService.getFormSchemaById).toHaveBeenCalledWith(expect.any(Object), 1, mockUser.id);
    });

    it('should return form schema for anonymous user', async () => {
      const anonApp = new Hono();
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.get('/api/forms/:id/schema', mockAnonAuth, async (c) => {
        const formId = parseInt(c.req.param('id'));
        const schema = await mockFormsService.getFormSchemaById(null, formId, null);
        return c.json({ data: schema[0].schema });
      });

      mockFormsService.getFormSchemaById.mockResolvedValue([{ schema: mockSchema }]);

      const response = await anonApp.request('/api/forms/1/schema', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockSchema);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid/schema', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return 404 when form not found', async () => {
      mockFormsService.getFormSchemaById.mockResolvedValue([]);

      const response = await app.request('/api/forms/999/schema', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found');
    });
  });

  describe('POST /api/forms', () => {
    const newFormData = {
      name: 'New Form',
      description: 'A new form',
      isPublic: true,
      schema: { components: [] },
    };

    it('should create new form successfully', async () => {
      mockFormsService.createForm.mockResolvedValue([{ ...mockForm, ...newFormData }]);

      const response = await app.request('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newFormData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.data.name).toBe(newFormData.name);
      expect(mockFormsService.createForm).toHaveBeenCalledWith(expect.any(Object), newFormData, mockUser.id);
    });

    it('should return 400 for validation errors', async () => {
      const invalidData = { name: '' }; // Missing required name

      const response = await app.request('/api/forms', {
        method: 'POST',
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
      
      unauthApp.post('/api/forms', mockUnauth);

      const response = await unauthApp.request('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 500 when database error occurs', async () => {
      mockFormsService.createForm.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(newFormData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create form');
    });
  });

  describe('PATCH /api/forms/:id', () => {
    const updateData = {
      name: 'Updated Form',
      description: 'Updated description',
      isPublic: false,
    };

    it('should update form successfully', async () => {
      mockFormsService.updateForm.mockResolvedValue([{ ...mockForm, ...updateData }]);

      const response = await app.request('/api/forms/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.name).toBe(updateData.name);
      expect(mockFormsService.updateForm).toHaveBeenCalledWith(expect.any(Object), 1, mockUser.id, updateData);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/forms/invalid', {
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

    it('should return 400 for validation errors', async () => {
      const invalidData = { name: '' }; // Empty name not allowed

      const response = await app.request('/api/forms/1', {
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
    });

    it('should return 401 when not authenticated', async () => {
      const unauthApp = new Hono();
      const mockUnauth = jest.fn(async (c) => {
        return c.json({ error: 'Unauthorized' }, 401);
      });
      
      unauthApp.patch('/api/forms/:id', mockUnauth);

      const response = await unauthApp.request('/api/forms/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when form not found or access denied', async () => {
      // Mock form write check to fail
      const noAccessApp = new Hono();
      const mockNoAccess = jest.fn(async (c) => {
        return c.json({ error: 'Form not found or access denied' }, 404);
      });
      
      noAccessApp.patch('/api/forms/:id', mockNoAccess);

      const response = await noAccessApp.request('/api/forms/999', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found or access denied');
    });

    it('should return 500 when database error occurs', async () => {
      mockFormsService.updateForm.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/forms/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to update form');
    });
  });
});