import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { submissions, submissionTokens, forms, users } from '../db/schema.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.js';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const submissionRoutes = new Hono();

// Validation schema
const createSubmissionSchema = z.object({
  formId: z.number(),
  data: z.any(),
});

// Submit form data
submissionRoutes.post('/', optionalAuthMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const user = c.get('jwtPayload')?.user;
    
    const validatedData = createSubmissionSchema.parse(body);

    // Check if form exists and user can submit
    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.id, validatedData.formId))
      .limit(1);

    if (form.length === 0) {
      return c.json({ error: 'Form not found' }, 404);
    }

    const formData = form[0];

    // Check access permissions
    if (!formData.isPublic && !user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Create submission
    const newSubmission = await db.insert(submissions).values({
      formId: validatedData.formId,
      data: validatedData.data,
      createdBy: user?.id || null,
      updatedBy: user?.id || null,
    }).returning();

    const submission = newSubmission[0];

    // Generate token for anonymous submissions
    let token = null;
    if (!user) {
      const tokenValue = randomBytes(32).toString('hex');
      await db.insert(submissionTokens).values({
        submissionId: submission.id,
        token: tokenValue,
      });
      token = tokenValue;
    }

    return c.json({ 
      data: { 
        id: submission.id,
        token,
        formId: submission.formId,
        submittedAt: submission.createdAt,
      } 
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.errors }, 400);
    }
    console.error('Error creating submission:', error);
    return c.json({ error: 'Failed to create submission' }, 500);
  }
});

// Get submission details
submissionRoutes.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const submissionId = parseInt(c.req.param('id'));
    const token = c.req.query('token');
    const user = c.get('jwtPayload')?.user;

    if (isNaN(submissionId)) {
      return c.json({ error: 'Invalid submission ID' }, 400);
    }

    const submission = await db
      .select({
        submission: submissions,
        form: forms,
        creator: users,
      })
      .from(submissions)
      .leftJoin(forms, eq(submissions.formId, forms.id))
      .leftJoin(users, eq(submissions.createdBy, users.id))
      .where(eq(submissions.id, submissionId))
      .limit(1);

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
      const submissionToken = await db
        .select()
        .from(submissionTokens)
        .where(and(
          eq(submissionTokens.submissionId, submissionId),
          eq(submissionTokens.token, token)
        ))
        .limit(1);

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
        schema: data.form?.schema,
        createdAt: data.submission.createdAt,
        isFormOwner: user?.id === data.form?.createdBy,
        submitterInformation: data.creator ? {
          name: data.creator.name,
          email: data.creator.email,
        } : null,
        token: !data.submission.createdBy ? token : undefined,
      }
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return c.json({ error: 'Failed to fetch submission' }, 500);
  }
});

// Get submissions for a form (form owner only)
submissionRoutes.get('/form/:formId', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('formId'));
    const user = c.get('jwtPayload').user;

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if user owns the form
    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.createdBy, user.id)))
      .limit(1);

    if (form.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const formSubmissions = await db
      .select({
        id: submissions.id,
        data: submissions.data,
        createdAt: submissions.createdAt,
        creator: users,
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.createdBy, users.id))
      .where(eq(submissions.formId, formId));

    const submissionsData = formSubmissions.map(sub => ({
      id: sub.id,
      data: sub.data,
      createdAt: sub.createdAt,
      submitterInformation: sub.creator ? {
        name: sub.creator.name,
        email: sub.creator.email,
      } : null,
      isAnonymous: !sub.creator,
    }));

    return c.json({ data: submissionsData });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

export default submissionRoutes;