import { randomBytes } from 'crypto';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import * as formsService from '../services/forms.js';
import * as submissionsService from '../services/submissions.js';

const submissionRoutes = new Hono();

// Validation schema for new submissions
const createSubmissionSchema = z.object({
  formId: z.number(),
  versionSha: z.string(),
  data: z.any(),
});

/**
 * Retrieves detailed submission data with access control
 * Allows access to form owners, submission creators, or via anonymous token
 */
submissionRoutes.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const submissionId = parseInt(c.req.param('id'));
    const token = c.req.query('token');
    const user = c.get('jwtPayload')?.user;

    if (isNaN(submissionId)) {
      return c.json({ error: 'Invalid submission ID' }, 400);
    }

    const submission = await submissionsService.getSubmissionById(db, submissionId);

    if (submission.length === 0) {
      return c.json({ error: 'Submission not found' }, 404);
    }

    const data = submission[0];

    // Check access permissions
    let hasAccess = false;

    // Form owner can always access
    if (user && data.form?.createdBy === user.id) {
      hasAccess = true;
    }
    // Submission creator can access their own submission
    else if (user && data.submission.createdBy === user.id) {
      hasAccess = true;
    }
    // Anonymous submissions can be accessed with token
    else if (!data.submission.createdBy && token) {
      const submissionToken = await submissionsService.getSubmissionToken(db, submissionId, token);

      if (submissionToken.length > 0) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return c.json({ error: 'Access denied' }, 403);
    }

    return c.json({
      data: {
        id: data.submission.id,
        formId: data.submission.formId,
        formName: data.form?.name,
        data: data.submission.data,
        schema: data.version?.schema || data.form?.schema,
        versionSha: data.submission.versionSha,
        version: data.version
          ? {
              sha: data.version.versionSha,
              description: data.version.description,
            }
          : null,
        createdAt: data.submission.createdAt,
        isFormOwner: user?.id === data.form?.createdBy,
        submitterInformation: data.creator
          ? {
              name: data.creator.name,
              email: data.creator.email,
            }
          : null,
        token: !data.submission.createdBy ? token : undefined,
      },
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return c.json({ error: 'Failed to fetch submission' }, 500);
  }
});

/**
 * Retrieves all submissions for a specific form (owner access only)
 * Returns submission data with creator information for analysis
 */
submissionRoutes.get('/form/:formId', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if user owns the form
    const form = await formsService.getFormByIdAndOwner(db, formId, user.id);

    if (form.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const formSubmissions = await submissionsService.getFormSubmissionsByOwner(db, formId);

    const submissionsData = formSubmissions.map((sub) => ({
      id: sub.id,
      data: sub.data,
      createdAt: sub.createdAt,
      submitterInformation: sub.creator
        ? {
            name: sub.creator.name,
            email: sub.creator.email,
          }
        : null,
      isAnonymous: !sub.creator,
    }));

    return c.json({ data: submissionsData });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

/**
 * Creates a new submission for a form (public endpoint)
 * Supports both authenticated and anonymous submissions with token generation
 */
submissionRoutes.post('/form/:formId', optionalAuthMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const user = c.get('jwtPayload')?.user;
    const body = await c.req.json();

    const validatedData = createSubmissionSchema.parse(body);

    // Check if form exists and user can submit
    const form = await submissionsService.getFormByIdForSubmission(db, formId);

    if (form.length === 0) {
      return c.json({ error: 'Form not found' }, 404);
    }

    const formData = form[0];

    // Check access permissions
    if (!formData.isPublic && !user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Create submission
    const newSubmission = await submissionsService.createSubmission(db, {
      formId: formId,
      versionSha: validatedData.versionSha,
      data: validatedData.data,
      createdBy: user?.id || null,
      updatedBy: user?.id || null,
    });

    const submission = newSubmission[0];

    // Generate token for anonymous submissions
    let token = null;
    if (!user) {
      const tokenValue = randomBytes(32).toString('hex');
      await submissionsService.createSubmissionToken(db, {
        submissionId: submission.id,
        token: tokenValue,
      });
      token = tokenValue;
    }

    return c.json(
      {
        data: {
          id: submission.id,
          token,
          formId: submission.formId,
          submittedAt: submission.createdAt,
        },
      },
      201,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.issues }, 400);
    }
    console.error('Error creating submission:', error);
    return c.json({ error: 'Failed to create submission' }, 500);
  }
});

export default submissionRoutes;
