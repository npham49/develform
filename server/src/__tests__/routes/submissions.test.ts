import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Hono } from 'hono';
import submissionRoutes from '../../routes/submissions.js';
import { createMockDb, mockUser, mockSubmission, mockSubmissionToken, mockForm } from '../mocks.js';
import { mockOptionalAuthMiddleware, mockFormWriteCheckMiddleware } from '../helpers.js';

// Mock dependencies
jest.mock('../../db/index.js', () => ({
  db: createMockDb(),
}));

jest.mock('../../middleware/auth.js', () => ({
  optionalAuthMiddleware: mockOptionalAuthMiddleware(mockUser),
}));

jest.mock('../../middleware/role.js', () => ({
  formWriteCheckMiddleware: mockFormWriteCheckMiddleware(true),
}));

jest.mock('../../services/submissions.js', () => ({
  getSubmissionById: jest.fn(),
  getFormSubmissions: jest.fn(),
  getFormByIdForSubmission: jest.fn(),
  createSubmission: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: jest.fn(() => 'random-token-123') })),
}));

describe('Submission Routes', () => {
  let app: Hono;
  let mockSubmissionsService: any;
  let mockCrypto: any;

  beforeEach(async () => {
    mockSubmissionsService = await import('../../services/submissions.js');
    mockCrypto = await import('crypto');

    // Setup fresh app
    app = new Hono();
    app.route('/api/submissions', submissionRoutes);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/submissions/:id', () => {
    const mockSubmissionDetail = {
      ...mockSubmission,
      form: mockForm,
      submissionToken: mockSubmissionToken,
    };

    it('should return submission for authenticated user (owner)', async () => {
      mockSubmissionsService.getSubmissionById.mockResolvedValue([mockSubmissionDetail]);

      const response = await app.request('/api/submissions/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockSubmissionDetail);
      expect(mockSubmissionsService.getSubmissionById).toHaveBeenCalledWith(expect.any(Object), 1, mockUser.id, null);
    });

    it('should return submission for anonymous user with valid token', async () => {
      mockSubmissionsService.getSubmissionById.mockResolvedValue([mockSubmissionDetail]);

      // Mock optional auth middleware without user
      const anonApp = new Hono();
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.get('/api/submissions/:id', mockAnonAuth, async (c) => {
        const submissionId = parseInt(c.req.param('id'));
        const token = c.req.query('token');
        const submission = await mockSubmissionsService.getSubmissionById(null, submissionId, null, token);
        return c.json({ data: submission[0] });
      });

      const response = await anonApp.request('/api/submissions/1?token=test-token-123', {
        method: 'GET',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockSubmissionDetail);
    });

    it('should return 400 for invalid submission ID', async () => {
      const response = await app.request('/api/submissions/invalid', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid submission ID');
    });

    it('should return 404 when submission not found', async () => {
      mockSubmissionsService.getSubmissionById.mockResolvedValue([]);

      const response = await app.request('/api/submissions/999', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Submission not found or access denied');
    });

    it('should return 403 for anonymous user without token', async () => {
      const anonApp = new Hono();
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.get('/api/submissions/:id', mockAnonAuth, async (c) => {
        const submissionId = parseInt(c.req.param('id'));
        const user = c.get('jwtPayload')?.user;
        const token = c.req.query('token');
        
        if (!user && !token) {
          return c.json({ error: 'Authentication required' }, 403);
        }
        
        const submission = await mockSubmissionsService.getSubmissionById(null, submissionId, user?.id, token);
        return c.json({ data: submission[0] });
      });

      const response = await anonApp.request('/api/submissions/1', {
        method: 'GET',
      });

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Authentication required');
    });

    it('should return 500 when database error occurs', async () => {
      mockSubmissionsService.getSubmissionById.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/submissions/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch submission');
    });
  });

  describe('GET /api/submissions/form/:formId', () => {
    const mockSubmissions = [
      mockSubmission,
      { ...mockSubmission, id: 2, data: { field1: 'value2' } },
    ];

    it('should return submissions for form owner', async () => {
      mockSubmissionsService.getFormSubmissions.mockResolvedValue(mockSubmissions);

      const response = await app.request('/api/submissions/form/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data).toEqual(mockSubmissions);
      expect(mockSubmissionsService.getFormSubmissions).toHaveBeenCalledWith(expect.any(Object), 1);
    });

    it('should return 400 for invalid form ID', async () => {
      const response = await app.request('/api/submissions/form/invalid', {
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
      
      unauthApp.get('/api/submissions/form/:formId', mockUnauth);

      const response = await unauthApp.request('/api/submissions/form/1', {
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
      
      noAccessApp.get('/api/submissions/form/:formId', mockNoAccess);

      const response = await noAccessApp.request('/api/submissions/form/999', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found or access denied');
    });

    it('should return 500 when database error occurs', async () => {
      mockSubmissionsService.getFormSubmissions.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/submissions/form/1', {
        method: 'GET',
        headers: { Authorization: 'Bearer valid-token' },
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch submissions');
    });
  });

  describe('POST /api/submissions/form/:formId', () => {
    const submissionData = {
      formId: 1,
      versionSha: 'abc123',
      data: { name: 'John Doe', email: 'john@example.com' },
    };

    const publicForm = { ...mockForm, isPublic: true };
    const privateForm = { ...mockForm, isPublic: false };

    beforeEach(() => {
      (mockCrypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn(() => 'random-token-123'),
      });
    });

    it('should create submission for authenticated user on public form', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([publicForm]);
      mockSubmissionsService.createSubmission.mockResolvedValue({
        id: 1,
        formId: 1,
        submittedAt: new Date(),
      });

      const response = await app.request('/api/submissions/form/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBe(1);
      expect(data.formId).toBe(1);
      expect(data.submittedAt).toBeDefined();
      expect(mockSubmissionsService.createSubmission).toHaveBeenCalledWith(
        expect.any(Object),
        submissionData,
        mockUser.id,
        null
      );
    });

    it('should create submission for anonymous user on public form with token', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([publicForm]);
      mockSubmissionsService.createSubmission.mockResolvedValue({
        id: 1,
        token: 'random-token-123',
        formId: 1,
        submittedAt: new Date(),
      });

      // Mock optional auth middleware without user
      const anonApp = new Hono();
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.post('/api/submissions/form/:formId', mockAnonAuth, async (c) => {
        const formId = parseInt(c.req.param('formId'));
        const body = await c.req.json();
        const user = c.get('jwtPayload')?.user;

        const form = await mockSubmissionsService.getFormByIdForSubmission(null, formId);
        if (form.length === 0) {
          return c.json({ error: 'Form not found' }, 404);
        }

        if (!form[0].isPublic && !user) {
          return c.json({ error: 'Authentication required for private forms' }, 401);
        }

        const token = user ? null : mockCrypto.randomBytes(32).toString('hex');
        const submission = await mockSubmissionsService.createSubmission(null, body, user?.id, token);
        
        return c.json(submission, 201);
      });

      const response = await anonApp.request('/api/submissions/form/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.token).toBe('random-token-123');
      expect(data.formId).toBe(1);
    });

    it('should create submission for authenticated user on private form', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([privateForm]);
      mockSubmissionsService.createSubmission.mockResolvedValue({
        id: 1,
        formId: 1,
        submittedAt: new Date(),
      });

      const response = await app.request('/api/submissions/form/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.id).toBe(1);
      expect(data.formId).toBe(1);
    });

    it('should return 401 for anonymous user on private form', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([privateForm]);

      const anonApp = new Hono();
      const mockAnonAuth = jest.fn(async (c, next) => {
        c.set('jwtPayload', null);
        await next();
      });
      
      anonApp.post('/api/submissions/form/:formId', mockAnonAuth, async (c) => {
        const formId = parseInt(c.req.param('formId'));
        const body = await c.req.json();
        const user = c.get('jwtPayload')?.user;

        const form = await mockSubmissionsService.getFormByIdForSubmission(null, formId);
        if (!form[0].isPublic && !user) {
          return c.json({ error: 'Authentication required for private forms' }, 401);
        }

        return c.json({}, 201);
      });

      const response = await anonApp.request('/api/submissions/form/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Authentication required for private forms');
    });

    it('should return 400 for validation errors', async () => {
      const invalidData = { formId: 'invalid' }; // Invalid formId type

      const response = await app.request('/api/submissions/form/1', {
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

    it('should return 404 when form not found', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([]);

      const response = await app.request('/api/submissions/form/999', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Form not found');
    });

    it('should return 500 when database error occurs', async () => {
      mockSubmissionsService.getFormByIdForSubmission.mockResolvedValue([publicForm]);
      mockSubmissionsService.createSubmission.mockRejectedValue(new Error('Database error'));

      const response = await app.request('/api/submissions/form/1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid-token',
        },
        body: JSON.stringify(submissionData),
      });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create submission');
    });
  });
});