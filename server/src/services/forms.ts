import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/index';
import { forms, submissions, users } from '../db/schema';

/**
 * Retrieves all forms created by a specific user
 * Returns basic form metadata without schema for performance
 */
export const getUserForms = async (db: Database, userId: number) => {
  return await db
    .select({
      id: forms.id,
      name: forms.name,
      description: forms.description,
      isPublic: forms.isPublic,
      createdAt: forms.createdAt,
      updatedAt: forms.updatedAt,
    })
    .from(forms)
    .where(eq(forms.createdBy, userId));
};

/**
 * Retrieves a form with creator information by ID
 * Used for form display and access control validation
 */
export const getFormById = async (db: Database, formId: number) => {
  return await db.select().from(forms).leftJoin(users, eq(forms.createdBy, users.id)).where(eq(forms.id, formId)).limit(1);
};

/**
 * Retrieves form data needed for public submission
 * Returns only essential fields: id, name, schema, and visibility
 */
export const getFormForSubmission = async (db: Database, formId: number) => {
  return await db
    .select({
      id: forms.id,
      name: forms.name,
      schema: forms.schema,
      isPublic: forms.isPublic,
    })
    .from(forms)
    .where(eq(forms.id, formId))
    .limit(1);
};

/**
 * Creates a new form with the authenticated user as owner
 * Sets both createdBy and updatedBy to current user ID
 */
export const createForm = async (
  db: Database,
  formData: {
    name: string;
    description?: string;
    isPublic?: boolean;
    schema?: unknown;
  },
  userId: number,
) => {
  return await db
    .insert(forms)
    .values({
      ...formData,
      createdBy: userId,
      updatedBy: userId,
    })
    .returning();
};

/**
 * Retrieves a form only if the user is the owner
 * Used for ownership verification before updates or deletions
 */
export const getFormByIdAndOwner = async (db: Database, formId: number, userId: number) => {
  return await db
    .select()
    .from(forms)
    .where(and(eq(forms.id, formId), eq(forms.createdBy, userId)))
    .limit(1);
};

/**
 * Updates form metadata (name, description, visibility)
 * Updates the updatedBy field and timestamp automatically
 */
export const updateForm = async (
  db: Database,
  formId: number,
  userId: number,
  updateData: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    schema?: unknown;
  },
) => {
  return await db
    .update(forms)
    .set({
      ...updateData,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .where(eq(forms.id, formId))
    .returning();
};

/**
 * Updates only the form schema/structure
 * Separate endpoint for schema updates to handle large JSON payloads
 */
export const updateFormSchema = async (db: Database, formId: number, userId: number, schema: unknown) => {
  return await db
    .update(forms)
    .set({
      schema,
      updatedBy: userId,
      updatedAt: new Date(),
    })
    .where(eq(forms.id, formId))
    .returning();
};

/**
 * Permanently deletes a form
 * Cascading deletes will remove associated submissions and tokens
 */
export const deleteForm = async (db: Database, formId: number) => {
  return await db.delete(forms).where(eq(forms.id, formId));
};

/**
 * Retrieves all submissions for a specific form
 * Includes submitter information when available (for authenticated submissions)
 */
export const getFormSubmissions = async (db: Database, formId: number) => {
  return await db
    .select({
      id: submissions.id,
      data: submissions.data,
      createdAt: submissions.createdAt,
      creator: users,
    })
    .from(submissions)
    .leftJoin(users, eq(submissions.createdBy, users.id))
    .where(eq(submissions.formId, formId));
};
