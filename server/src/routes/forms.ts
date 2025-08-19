import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/index.js';
import { forms, submissions, user } from '../db/schema.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const formRoutes = new Hono();

// Validation schemas
const createFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
  schema: z.any().optional(),
});

const updateFormSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  schema: z.any().optional(),
});

// Get all forms for authenticated user
formRoutes.get('/', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');

    const userForms = await db
      .select({
        id: forms.id,
        name: forms.name,
        description: forms.description,
        isPublic: forms.isPublic,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
      })
      .from(forms)
      .where(eq(forms.createdBy, currentUser!.id));

    return c.json({ data: userForms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return c.json({ error: 'Failed to fetch forms' }, 500);
  }
});

// Get single form by ID
formRoutes.get('/:id', optionalAuthMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const form = await db.select().from(forms).leftJoin(user, eq(forms.createdBy, user.id)).where(eq(forms.id, formId)).limit(1);

    if (form.length === 0) {
      return c.json({ error: 'Form not found' }, 404);
    }

    const formData = form[0];

    // Check if user can access this form
    if (!formData.forms.isPublic && (!currentUser || currentUser!.id !== formData.forms.createdBy)) {
      return c.json({ error: 'Access denied' }, 403);
    }

    return c.json({
      data: {
        ...formData.forms,
        creator: formData.user
          ? {
              id: formData.user.id,
              name: formData.user.name,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    return c.json({ error: 'Failed to fetch form' }, 500);
  }
});

// Get form schema for submission (public endpoint)
formRoutes.get('/:id/submit', optionalAuthMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const form = await db
      .select({
        id: forms.id,
        name: forms.name,
        schema: forms.schema,
        isPublic: forms.isPublic,
      })
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (form.length === 0) {
      return c.json({ error: 'Form not found' }, 404);
    }

    const formData = form[0];

    // Check access permissions
    if (!formData.isPublic && !user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    return c.json({
      data: {
        id: formData.id,
        name: formData.name,
        schema: formData.schema,
      },
    });
  } catch (error) {
    console.error('Error fetching form schema:', error);
    return c.json({ error: 'Failed to fetch form schema' }, 500);
  }
});

// Create new form
formRoutes.post('/', authMiddleware, async (c) => {
  try {
    const currentUser = c.get('user');
    const body = await c.req.json();

    const validatedData = createFormSchema.parse(body);

    const newForm = await db
      .insert(forms)
      .values({
        ...validatedData,
        createdBy: currentUser!.id,
        updatedBy: currentUser!.id,
      })
      .returning();

    return c.json({ data: newForm[0] }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.errors }, 400);
    }
    console.error('Error creating form:', error);
    return c.json({ error: 'Failed to create form' }, 500);
  }
});

// Update form
formRoutes.patch('/:id', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');
    const body = await c.req.json();

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const validatedData = updateFormSchema.parse(body);

    // Check if form exists and user owns it
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.createdBy, currentUser!.id)))
      .limit(1);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const updatedForm = await db
      .update(forms)
      .set({
        ...validatedData,
        updatedBy: currentUser!.id,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, formId))
      .returning();

    return c.json({ data: updatedForm[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.errors }, 400);
    }
    console.error('Error updating form:', error);
    return c.json({ error: 'Failed to update form' }, 500);
  }
});

// Update form schema specifically
formRoutes.patch('/:id/schema', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');
    const body = await c.req.json();

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    const schemaSchema = z.object({
      schema: z.any(),
    });

    const validatedData = schemaSchema.parse(body);

    // Check if form exists and user owns it
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.createdBy, currentUser!.id)))
      .limit(1);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    const updatedForm = await db
      .update(forms)
      .set({
        schema: validatedData.schema,
        updatedBy: currentUser!.id,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, formId))
      .returning();

    return c.json({ data: updatedForm[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.errors }, 400);
    }
    console.error('Error updating form schema:', error);
    return c.json({ error: 'Failed to update form schema' }, 500);
  }
});

// Delete form
formRoutes.delete('/:id', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.createdBy, currentUser!.id)))
      .limit(1);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    await db.delete(forms).where(eq(forms.id, formId));

    return c.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return c.json({ error: 'Failed to delete form' }, 500);
  }
});

// Get form submissions (form owner only)
formRoutes.get('/:id/submissions', authMiddleware, async (c) => {
  try {
    const formId = parseInt(c.req.param('id'));
    const currentUser = c.get('user');

    if (isNaN(formId)) {
      return c.json({ error: 'Invalid form ID' }, 400);
    }

    // Check if form exists and user owns it
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, formId), eq(forms.createdBy, currentUser!.id)))
      .limit(1);

    if (existingForm.length === 0) {
      return c.json({ error: 'Form not found or access denied' }, 404);
    }

    // Get submissions for this form
    const formSubmissions = await db
      .select({
        id: submissions.id,
        data: submissions.data,
        createdAt: submissions.createdAt,
        creator: user,
      })
      .from(submissions)
      .leftJoin(user, eq(submissions.createdBy, user.id))
      .where(eq(submissions.formId, formId));

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
    return c.json({ error: 'Failed to fetch form submissions' }, 500);
  }
});

export default formRoutes;
