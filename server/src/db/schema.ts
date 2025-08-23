import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  password: text('password'),
  githubId: text('github_id').unique(),
  avatarUrl: text('avatar_url'),
  emailVerifiedAt: timestamp('email_verified_at'),
  rememberToken: text('remember_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Forms table
export const forms = pgTable('forms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').default(true),
  schema: jsonb('schema'),
  liveVersionId: integer('live_version_id'),
  createdBy: integer('created_by')
    .references(() => users.id)
    .notNull(),
  updatedBy: integer('updated_by')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Form versions table
export const formVersions = pgTable(
  'form_versions',
  {
    id: serial('id').primaryKey(),
    formId: integer('form_id')
      .references(() => forms.id, { onDelete: 'cascade' })
      .notNull(),
    versionSha: text('version_sha').notNull(),
    description: text('description'),
    schema: jsonb('schema').notNull(),
    isPublished: boolean('is_published').default(false),
    publishedAt: timestamp('published_at'),
    createdBy: integer('created_by')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    index('idx_form_versions_form_id').on(table.formId),
    index('idx_form_versions_published').on(table.formId, table.isPublished),
    unique('form_versions_version_sha_unique').on(table.versionSha),
  ],
);

// Submissions table
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  formId: integer('form_id')
    .references(() => forms.id, { onDelete: 'cascade' })
    .notNull(),
  versionSha: text('version_sha').references(() => formVersions.versionSha),
  data: jsonb('data').notNull(),
  createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  updatedBy: integer('updated_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Submission tokens table (for anonymous submissions)
export const submissionTokens = pgTable('submission_tokens', {
  id: serial('id').primaryKey(),
  submissionId: integer('submission_id')
    .references(() => submissions.id, { onDelete: 'cascade' })
    .notNull(),
  token: text('token').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Jobs table (for queue management if needed)
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  queue: text('queue').notNull(),
  payload: jsonb('payload').notNull(),
  attempts: integer('attempts').default(0),
  reservedAt: timestamp('reserved_at'),
  availableAt: timestamp('available_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type FormVersion = typeof formVersions.$inferSelect;
export type NewFormVersion = typeof formVersions.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type SubmissionToken = typeof submissionTokens.$inferSelect;
export type NewSubmissionToken = typeof submissionTokens.$inferInsert;
