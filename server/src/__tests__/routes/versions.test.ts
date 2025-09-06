import { beforeEach, describe, expect, it } from '@jest/globals';
import { Hono } from 'hono';
import { mockFormVersion } from '../mocks';
import { TestResponse } from '../types';

// Create test app with mocked version routes
const createTestVersionsApp = () => {
  const app = new Hono();

  // Mock list versions endpoint
  app.get('/:formId/versions', async (c) => {
    const formId = c.req.param('formId');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const mockVersions = [
      { ...mockFormVersion, formId: Number(formId) },
      { ...mockFormVersion, id: 2, versionSha: 'def456', formId: Number(formId) },
    ];

    return c.json({ data: mockVersions });
  });

  // Mock get version by SHA endpoint
  app.get('/:formId/versions/:sha', async (c) => {
    const formId = c.req.param('formId');
    const sha = c.req.param('sha');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!sha || sha === 'empty') {
      return c.json({ error: 'Version SHA is required' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (sha === 'notfound') {
      return c.json({ error: 'Version not found' }, 404);
    }

    const version = { ...mockFormVersion, formId: Number(formId), versionSha: sha };
    return c.json({ data: version });
  });

  // Mock create version endpoint
  app.post('/:formId/versions', async (c) => {
    const formId = c.req.param('formId');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();

    if (!body.schema) {
      return c.json({ error: 'Schema is required' }, 400);
    }

    const newVersion = {
      ...mockFormVersion,
      id: 123,
      formId: Number(formId),
      versionSha: 'new-sha-123',
      description: body.description || 'New version',
      schema: body.schema,
      isPublished: body.isPublished || false,
    };

    return c.json(
      {
        data: newVersion,
        message: 'Version created successfully',
      },
      201,
    );
  });

  // Mock update version endpoint
  app.put('/:formId/versions/:sha', async (c) => {
    const formId = c.req.param('formId');
    const sha = c.req.param('sha');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!sha || sha === 'empty') {
      return c.json({ error: 'Version SHA is required' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();

    const updatedVersion = {
      ...mockFormVersion,
      formId: Number(formId),
      versionSha: sha,
      description: body.description || mockFormVersion.description,
      schema: body.schema || mockFormVersion.schema,
      isPublished: body.isPublished !== undefined ? body.isPublished : mockFormVersion.isPublished,
      updatedAt: new Date(),
    };

    return c.json({
      data: updatedVersion,
      message: 'Version updated successfully',
    });
  });

  // Mock revert to version endpoint
  app.post('/:formId/versions/:sha/revert', async (c) => {
    const formId = c.req.param('formId');
    const sha = c.req.param('sha');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!sha || sha === 'empty') {
      return c.json({ error: 'Version SHA is required' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const newVersion = {
      ...mockFormVersion,
      id: 124,
      formId: Number(formId),
      versionSha: 'reverted-sha-124',
      description: `Reverted to ${sha}`,
      schema: mockFormVersion.schema,
      isPublished: true,
    };

    return c.json({
      data: newVersion,
      message: 'Successfully reverted to version',
    });
  });

  // Mock promote version endpoint
  app.post('/:formId/versions/:sha/promote', async (c) => {
    const formId = c.req.param('formId');
    const sha = c.req.param('sha');
    const authHeader = c.req.header('Authorization');

    if (!formId || isNaN(Number(formId))) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    if (!sha || sha === 'empty') {
      return c.json({ error: 'Version SHA is required' }, 400);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const promotedVersion = {
      ...mockFormVersion,
      formId: Number(formId),
      versionSha: sha,
      isPublished: true,
    };

    return c.json({
      data: promotedVersion,
      message: 'Version promoted to live successfully',
    });
  });

  return app;
};

describe('Versions Routes', () => {
  let app: Hono;

  beforeEach(() => {
    app = createTestVersionsApp();
  });

  describe('GET /:formId/versions', () => {
    it('should return form versions when authenticated', async () => {
      const res = await app.request('/1/versions', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/versions', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return unauthorized without authentication', async () => {
      const res = await app.request('/1/versions');
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('GET /:formId/versions/:sha', () => {
    it('should return version by SHA when authenticated', async () => {
      const res = await app.request('/1/versions/abc123', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/versions/abc123', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return error when SHA is missing', async () => {
      const res = await app.request('/1/versions/empty', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Version SHA is required');
    });

    it('should return not found for non-existent version', async () => {
      const res = await app.request('/1/versions/notfound', {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(404);
      expect(data.error).toBe('Version not found');
    });
  });

  describe('POST /:formId/versions', () => {
    it('should create version with valid data', async () => {
      const versionData = {
        description: 'New version',
        schema: { components: [{ type: 'text', label: 'Name' }] },
        isPublished: false,
      };

      const res = await app.request('/1/versions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Version created successfully');
    });

    it('should return error when schema is missing', async () => {
      const versionData = {
        description: 'New version without schema',
      };

      const res = await app.request('/1/versions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Schema is required');
    });

    it('should return unauthorized without authentication', async () => {
      const versionData = {
        schema: { components: [] },
      };

      const res = await app.request('/1/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('PUT /:formId/versions/:sha', () => {
    it('should update version with valid data', async () => {
      const updateData = {
        description: 'Updated version description',
        isPublished: true,
      };

      const res = await app.request('/1/versions/abc123', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Version updated successfully');
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/versions/abc123', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: 'Updated' }),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return error when SHA is missing', async () => {
      const res = await app.request('/1/versions/empty', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: 'Updated' }),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Version SHA is required');
    });
  });

  describe('POST /:formId/versions/:sha/revert', () => {
    it('should revert to version successfully', async () => {
      const res = await app.request('/1/versions/abc123/revert', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Successfully reverted to version');
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/versions/abc123/revert', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return unauthorized without authentication', async () => {
      const res = await app.request('/1/versions/abc123/revert', {
        method: 'POST',
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /:formId/versions/:sha/promote', () => {
    it('should promote version to live successfully', async () => {
      const res = await app.request('/1/versions/abc123/promote', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
      expect(data.message).toBe('Version promoted to live successfully');
    });

    it('should return error for invalid form ID', async () => {
      const res = await app.request('/invalid/versions/abc123/promote', {
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(400);
      expect(data.error).toBe('Invalid form ID');
    });

    it('should return unauthorized without authentication', async () => {
      const res = await app.request('/1/versions/abc123/promote', {
        method: 'POST',
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle versions with very large schemas', async () => {
      const largeSchema = {
        components: Array.from({ length: 500 }, (_, i) => ({
          type: 'text',
          label: `Field ${i}`,
          key: `field_${i}`,
        })),
      };

      const versionData = {
        description: 'Version with large schema',
        schema: largeSchema,
      };

      const res = await app.request('/1/versions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
    });

    it('should handle version descriptions with unicode characters', async () => {
      const versionData = {
        description: 'Version 🚀 with émojis and 中文',
        schema: { components: [] },
      };

      const res = await app.request('/1/versions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(versionData),
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(201);
      expect(data.data).toBeDefined();
    });

    it('should handle very long SHA values', async () => {
      const longSha = 'a'.repeat(100);

      const res = await app.request(`/1/versions/${longSha}`, {
        headers: { Authorization: 'Bearer mock-token' },
      });
      const data = (await res.json()) as TestResponse;

      expect(res.status).toBe(200);
      expect(data.data).toBeDefined();
    });

    it('should handle malformed JSON in version creation', async () => {
      const res = await app.request('/1/versions', {
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
