import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import * as formsService from '../services/forms.js';
import * as versionsService from '../services/versions.js';

const versionRoutes = new Hono();

// Validation schemas for version operations
const createVersionSchema = z.object({
  description: z.string().optional(),
  schema: z.any(),
  publish: z.boolean().default(false),
});

const updateVersionSchema = z.object({
  description: z.string().optional(),
});

const revertVersionSchema = z.object({
  description: z.string().optional(),
});

/**
 * Retrieves all versions for a specific form
 * Returns version history with author information
 */
versionRoutes.get('/forms/:formId/versions', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const versions = await versionsService.getFormVersions(db, formId);
    const publishedVersion = await versionsService.getPublishedVersion(db, formId);

    return c.json({
      data: {
        versions,
        liveVersion: publishedVersion.length > 0 ? publishedVersion[0].versionSha : null,
      },
    });
  } catch (error) {
    console.error('Error fetching form versions:', error);
    return c.json({ error: 'Failed to fetch form versions' }, 500);
  }
});

/**
 * Creates a new form version
 * Optionally publishes the version immediately
 */
versionRoutes.post('/forms/:formId/versions', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const user = c.get('jwtPayload').user;
    const body = await c.req.json();

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const validatedData = createVersionSchema.parse(body);

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const newVersion = await versionsService.createVersion(
      db,
      {
        formId,
        description: validatedData.description,
        schema: validatedData.schema,
        isPublished: validatedData.publish,
      },
      user.id,
    );

    return c.json(
      {
        data: {
          version: newVersion[0],
          sha: newVersion[0].versionSha,
        },
      },
      201,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.issues }, 400);
    }
    console.error('Error creating version:', error);
    return c.json({ error: 'Failed to create version' }, 500);
  }
});

/**
 * Updates version metadata (description only)
 * Only draft versions can be updated
 */
versionRoutes.put('/forms/:formId/versions/:sha', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;
    const body = await c.req.json();

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const validatedData = updateVersionSchema.parse(body);

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const updatedVersion = await versionsService.updateVersion(db, formId, versionSha, validatedData);

    if (updatedVersion.length === 0) {
      return c.json({ error: 'Version not found or already published' }, 404);
    }

    return c.json({ data: updatedVersion[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.issues }, 400);
    }
    console.error('Error updating version:', error);
    return c.json({ error: 'Failed to update version' }, 500);
  }
});

/**
 * Deletes a version (only if not published)
 * Published versions cannot be deleted for data integrity
 */
versionRoutes.delete('/forms/:formId/versions/:sha', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const result = await versionsService.deleteVersion(db, formId, versionSha);

    if (result.length === 0) {
      return c.json({ error: 'Version not found or already published' }, 404);
    }

    return c.json({ message: 'Version deleted successfully' });
  } catch (error) {
    console.error('Error deleting version:', error);
    return c.json({ error: 'Failed to delete version' }, 500);
  }
});

/**
 * Publishes a specific version
 * Makes the version live and unpublishes others
 */
versionRoutes.post('/forms/:formId/versions/:sha/publish', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const publishedVersion = await versionsService.publishVersion(db, formId, versionSha);

    if (publishedVersion.length === 0) {
      return c.json({ error: 'Version not found' }, 404);
    }

    return c.json({ data: publishedVersion[0] });
  } catch (error) {
    console.error('Error publishing version:', error);
    return c.json({ error: 'Failed to publish version' }, 500);
  }
});

/**
 * Force reset to a specific version
 * Deletes all versions created after the target version
 */
versionRoutes.post('/forms/:formId/versions/:sha/force-reset', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const result = await versionsService.forceResetToVersion(db, formId, versionSha);

    return c.json({
      data: result,
      message: 'Successfully reset to version and deleted subsequent versions',
    });
  } catch (error) {
    console.error('Error force resetting version:', error);
    return c.json({ error: 'Failed to force reset to version' }, 500);
  }
});

/**
 * Make an old version live without deleting history
 * Simply changes which version is published
 */
versionRoutes.post('/forms/:formId/versions/:sha/make-live', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const result = await versionsService.makeVersionLive(db, formId, versionSha);

    return c.json({
      data: result,
      message: 'Successfully made version live',
    });
  } catch (error) {
    console.error('Error making version live:', error);
    return c.json({ error: 'Failed to make version live' }, 500);
  }
});

/**
 * Create a new latest version based on an old version
 * Duplicates the old schema as a new version
 */
versionRoutes.post('/forms/:formId/versions/:sha/make-latest', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const versionSha = c.req.param('sha');
    const user = c.get('jwtPayload').user;
    const body = await c.req.json();

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const validatedData = revertVersionSchema.parse(body);

    // Check if form exists and user owns it
    const existingForm = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const result = await versionsService.makeVersionLatest(db, formId, versionSha, user.id, validatedData.description);

    return c.json({
      data: result,
      message: 'Successfully created new version from old schema',
    });
  } catch (error) {
    console.error('Error making version latest:', error);
    return c.json({ error: 'Failed to make version latest' }, 500);
  }
});

export default versionRoutes;
