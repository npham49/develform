import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Better-auth compatible Users table
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Better-auth Sessions table
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Better-auth Accounts table (for OAuth providers)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Legacy users table for migration compatibility - will be removed after migration
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
  createdBy: text('created_by')
    .references(() => user.id)
    .notNull(),
  updatedBy: text('updated_by')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Submissions table
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  formId: integer('form_id')
    .references(() => forms.id, { onDelete: 'cascade' })
    .notNull(),
  data: jsonb('data').notNull(),
  createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  updatedBy: text('updated_by').references(() => user.id, { onDelete: 'set null' }),
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

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type SubmissionToken = typeof submissionTokens.$inferSelect;
export type NewSubmissionToken = typeof submissionTokens.$inferInsert;
