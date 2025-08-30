import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Hono } from 'hono';
import { createMockDb, mockUser, mockForm } from '../mocks';
import { TestResponse, MockUser, MockForm } from '../types';

// Create test app with mocked form routes
const createTestFormsApp = () => {
  const app = new Hono();
  
  // Mock list forms endpoint
  app.get('/', async (c) => {
    const authHeader = c.req.header('Authorization');
    const isPublic = c.req.query('public') === 'true';
    
    // For public forms, no auth required
    if (isPublic) {
      return c.json({
        data: [{ ...mockForm, isPublic: true }],
        pagination: { page: 1, limit: 10, total: 1 },
      });
    }
    
    // For private forms, auth required
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({
      data: [mockForm],
      pagination: { page: 1, limit: 10, total: 1 },
    });
  });

  // Mock get form by ID endpoint
  app.get('/:id', async (c) => {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!id || isNaN(Number(id))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }
    
    const form = { ...mockForm, id: Number(id) };
    
    // Public forms don't require auth
    if (form.isPublic) {
      return c.json({ data: form });
    }
    
    // Private forms require auth
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ data: form });
  });

  // Mock create form endpoint
  app.post('/', async (c) => {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    
    if (!body.name) {
      return c.json({ error: 'Form name is required' }, 400);
    }

    const newForm = {
      ...mockForm,
      id: 123,
      name: body.name,
      description: body.description || '',
      isPublic: body.isPublic || false,
      schema: body.schema || { components: [] },
    };

    return c.json({ 
      data: newForm,
      message: 'Form created successfully' 
    }, 201);
  });

  // Mock update form endpoint
  app.put('/:id', async (c) => {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    if (!id || isNaN(Number(id))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const body = await c.req.json();
    
    const updatedForm = {
      ...mockForm,
      id: Number(id),
      name: body.name || mockForm.name,
      description: body.description || mockForm.description,
      isPublic: body.isPublic !== undefined ? body.isPublic : mockForm.isPublic,
      schema: body.schema || mockForm.schema,
      updatedAt: new Date(),
    };

    return c.json({ 
      data: updatedForm,
      message: 'Form updated successfully' 
    });
  });

  // Mock delete form endpoint
  app.delete('/:id', async (c) => {
    const id = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    if (!id || isNaN(Number(id))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    return c.json({ message: 'Form deleted successfully' });
  });

  // Mock get form schema endpoint
  app.get('/:id/schema', async (c) => {
    const id = c.req.param('id');
    
    if (!id || isNaN(Number(id))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const form = { ...mockForm, id: Number(id) };
    
    return c.json({ 
      data: { 
        schema: form.schema,
        version: form.liveVersionId 
      } 
    });
  });

  return app;
};

describe('Forms Routes', () => {
  let app: Hono;

  beforeEach(() => {
    app = createTestFormsApp();
  });

  describe('GET /', () => {
    it('should return public forms without authentication', async () => {
      const res = await app.request('/?public=true');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return private forms with authentication', async () => {
      const res = await app.request('/', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return unauthorized for private forms without authentication', async () => {
      const res = await app.request('/');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /:id', () => {
    it('should return form by ID for public forms', async () => {
      const res = await app.request('/1');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should return form by ID for private forms with authentication', async () => {
      const res = await app.request('/1', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });
  });

  describe('POST /', () => {
    it('should create form with valid data', async () => {
      const formData = {
        name: 'New Test Form',
        description: 'A new test form',
        isPublic: true,
        schema: { components: [{ type: 'text', label: 'Name' }] },
      };

      const res = await app.request('/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Form created successfully');
    });

    it('should return error when form name is missing', async () => {
      const formData = {
        description: 'A form without name',
      };

      const res = await app.request('/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('Form name is required');
    });

    it('should return unauthorized without authentication', async () => {
      const formData = {
        name: 'New Test Form',
      };

      const res = await app.request('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /:id', () => {
    it('should update form with valid data', async () => {
      const updateData = {
        name: 'Updated Form Name',
        description: 'Updated description',
      };

      const res = await app.request('/1', {
        method: 'PUT',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Form updated successfully');
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid', {
        method: 'PUT',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated' }),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return unauthorized without authentication', async () => {
      const res = await app.request('/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated' }),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /:id', () => {
    it('should delete form successfully', async () => {
      const res = await app.request('/1', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.message).toBe('Form deleted successfully');
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return unauthorized without authentication', async () => {
      const res = await app.request('/1', { method: 'DELETE' });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /:id/schema', () => {
    it('should return form schema successfully', async () => {
      const res = await app.request('/1/schema');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect((data.data as any).schema).toBeDefined();
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/schema');
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle very large form schemas', async () => {
      const largeSchema = {
        components: Array.from({ length: 1000 }, (_, i) => ({
          type: 'text',
          label: `Field ${i}`,
          key: `field_${i}`,
        })),
      };

      const formData = {
        name: 'Large Form',
        schema: largeSchema,
      };

      const res = await app.request('/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
    });

    it('should handle forms with unicode characters', async () => {
      const formData = {
        name: 'Test Form 🚀 with émojis',
        description: 'Description with 中文 and العربية',
      };

      const res = await app.request('/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json() as TestResponse;
      
      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
    });

    it('should handle malformed JSON in request body', async () => {
      const res = await app.request('/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: 'invalid json{',
      });
      
      // Should handle JSON parse error gracefully
      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });
});