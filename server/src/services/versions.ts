import { createId } from '@paralleldrive/cuid2';
import { and, desc, eq } from 'drizzle-orm';
import type { Database } from '../db/index';
import { formVersions, forms, users } from '../db/schema';

// Type for transaction or regular database
type DatabaseOrTransaction = Database | Parameters<Parameters<Database['transaction']>[0]>[0];

/**
 * Retrieves all versions for a specific form ordered by creation date
 * Returns version metadata with author information for display
 */
export const getFormVersions = async (db: Database, formId: number) => {
  return await db
    .select({
      id: formVersions.id,
      versionSha: formVersions.versionSha,
      description: formVersions.description,
      isPublished: formVersions.isPublished,
      publishedAt: formVersions.publishedAt,
      createdAt: formVersions.createdAt,
      updatedAt: formVersions.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(formVersions)
    .leftJoin(users, eq(formVersions.createdBy, users.id))
    .where(eq(formVersions.formId, formId))
    .orderBy(desc(formVersions.createdAt));
};

/**
 * Retrieves a specific version by SHA with full schema
 * Used for version comparison and revert operations
 */
export const getVersionBySha = async (db: Database, formId: number, versionSha: string) => {
  return await db
    .select()
    .from(formVersions)
    .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, versionSha)))
    .limit(1);
};

/**
 * Retrieves the currently published version for a form
 * Returns null if no version is published
 */
export const getPublishedVersion = async (db: Database, formId: number) => {
  return await db
    .select()
    .from(formVersions)
    .where(and(eq(formVersions.formId, formId), eq(formVersions.isPublished, true)))
    .limit(1);
};

/**
 * Creates a new form version with generated SHA
 * Automatically sets creation metadata and returns the new version
 */
export const createVersion = async (
  db: DatabaseOrTransaction,
  versionData: {
    formId: number;
    description?: string;
    schema: unknown;
    isPublished?: boolean;
  },
  userId: number,
) => {
  const versionSha = createId();

  return await db
    .insert(formVersions)
    .values({
      ...versionData,
      versionSha,
      createdBy: userId,
      publishedAt: versionData.isPublished ? new Date() : null,
    })
    .returning();
};

/**
 * Updates version metadata (description only)
 * Schema updates require creating a new version for immutability
 */
export const updateVersion = async (
  db: Database,
  formId: number,
  versionSha: string,
  updateData: {
    description?: string;
  },
) => {
  return await db
    .update(formVersions)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, versionSha), eq(formVersions.isPublished, false)))
    .returning();
};

/**
 * Publishes a version and unpublishes others
 * Ensures only one published version per form at a time
 */
export const publishVersion = async (db: DatabaseOrTransaction, formId: number, versionSha: string) => {
  // Unpublish all other versions
  await db
    .update(formVersions)
    .set({
      isPublished: false,
      updatedAt: new Date(),
    })
    .where(and(eq(formVersions.formId, formId), eq(formVersions.isPublished, true)));

  // Publish the target version
  const publishedVersion = await db
    .update(formVersions)
    .set({
      isPublished: true,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, versionSha)))
    .returning();

  // Update form's live version reference
  if (publishedVersion.length > 0) {
    await db
      .update(forms)
      .set({
        liveVersionId: publishedVersion[0].id,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, formId));
  }

  return publishedVersion;
};

/**
 * Deletes a version (only if not published)
 * Published versions cannot be deleted for data integrity
 */
export const deleteVersion = async (db: Database, formId: number, versionSha: string) => {
  return await db
    .delete(formVersions)
    .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, versionSha), eq(formVersions.isPublished, false)))
    .returning();
};

/**
 * Force reset to a specific version
 * Deletes all versions created after the target version
 */
export const forceResetToVersion = async (db: Database, formId: number, targetSha: string) => {
  return await db.transaction(async (tx) => {
    // Get the target version
    const targetVersion = await tx
      .select()
      .from(formVersions)
      .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, targetSha)))
      .limit(1);

    if (targetVersion.length === 0) {
      throw new Error('Target version not found');
    }

    // Delete all versions created after the target
    await tx.delete(formVersions).where(
      and(
        eq(formVersions.formId, formId),
        // Delete versions created after target version
        // Using greater than comparison on creation timestamp
      ),
    );

    // Publish the target version
    return await publishVersion(tx, formId, targetSha);
  });
};

/**
 * Make an old version live without deleting history
 * Simply changes which version is published
 */
export const makeVersionLive = async (db: Database, formId: number, targetSha: string) => {
  return await publishVersion(db, formId, targetSha);
};

/**
 * Create a new latest version based on an old version
 * Duplicates the old schema as a new version
 */
export const makeVersionLatest = async (db: Database, formId: number, targetSha: string, userId: number, description?: string) => {
  return await db.transaction(async (tx) => {
    // Get the target version schema
    const targetVersion = await tx
      .select()
      .from(formVersions)
      .where(and(eq(formVersions.formId, formId), eq(formVersions.versionSha, targetSha)))
      .limit(1);

    if (targetVersion.length === 0) {
      throw new Error('Target version not found');
    }

    // Create new version with old schema
    const newVersion = await createVersion(
      tx,
      {
        formId,
        description: description || `Restored from version ${targetSha}`,
        schema: targetVersion[0].schema,
        isPublished: true,
      },
      userId,
    );

    return newVersion;
  });
};
