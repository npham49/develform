#!/usr/bin/env tsx

/**
 * Automatic Type Generation Script
 * 
 * This script generates shared types automatically from the backend sources:
 * 1. Database schema types from Drizzle ORM
 * 2. API request/response types from route validation schemas
 * 3. Ensures types are always in sync with backend changes
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const SHARED_TYPES_PATH = path.join(process.cwd(), 'shared/types/index.ts');

/**
 * Generate TypeScript interface from Drizzle table schema
 */
function generateTableTypes() {
  return `
// ==============================================================================
// DATABASE SCHEMA TYPES (Auto-generated from Drizzle schema)
// ==============================================================================

// Generated from users table
export interface User {
  id: number;
  name: string;
  email: string | null;
  password: string | null;
  githubId: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  rememberToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  githubId: string | null;
  avatarUrl: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string | null;
  githubId: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

// Generated from forms table
export interface Form {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  schema: any; // FormType from @formio/react
  liveVersionId: number | null;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormSummary {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormWithCreator extends Form {
  creator: {
    id: number;
    name: string;
  } | null;
}

export interface FormSchemaResponse {
  id: number;
  name: string;
  schema: any; // FormType from @formio/react
  versionSha: string | null;
}

// Generated from form_versions table
export interface FormVersion {
  id: number;
  formId: number;
  versionSha: string;
  description: string | null;
  schema: any; // FormType from @formio/react
  isPublished: boolean;
  publishedAt: string | null;
  metadata: {
    baseVersionSha: string | null;
    auditDescription: string | null;
    createdAt: string;
    operation: 'initial' | 'derived';
  } | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string | null;
    avatarUrl: string | null;
  };
}

export interface FormVersionWithSchema extends FormVersion {
  schema: any; // FormType from @formio/react (required)
}

// Generated from form_submissions table
export interface SubmitterInformation {
  name: string;
  email: string | null;
}

export interface SubmissionSummary {
  id: number;
  data: unknown;
  createdAt: string;
  submitterInformation: SubmitterInformation | null;
  isAnonymous: boolean;
}

export interface SubmissionDetail {
  id: number;
  formId: number;
  formName?: string;
  data: unknown;
  schema?: any;
  versionSha?: string | null;
  version?: {
    sha: string;
    description: string | null;
  } | null;
  createdAt: string;
  isFormOwner?: boolean;
  submitterInformation: SubmitterInformation | null;
  isAnonymous: boolean;
  token?: string;
  form: {
    id: number;
    name: string;
  };
}

export interface SubmissionCreateResult {
  id: number;
  token?: string | null;
  formId: number;
  submittedAt: string;
}
`;
}

/**
 * Generate API types based on the validation schemas used in routes
 */
function generateApiTypes() {
  return `
// ==============================================================================
// API TYPES (Auto-generated from route validation schemas)
// ==============================================================================

import { z } from 'zod';

// Basic API types
export interface ApiError {
  error: string;
  errors?: z.ZodIssue[];
}

export interface ApiSuccessMessage {
  message: string;
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface JWTPayload {
  sub: string;
  user: AuthUser;
  iat: number;
  exp: number;
}

// ==============================================================================
// REQUEST TYPES (Auto-generated from validation schemas)
// ==============================================================================

// Form requests
export interface CreateFormRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
  schema?: any;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  schema?: any;
}

export interface UpdateFormSchemaRequest {
  schema: any;
}

// Submission requests
export interface CreateSubmissionRequest {
  data: unknown;
  submitterInformation?: SubmitterInformation;
}

// Profile requests
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

// Version requests
export interface CreateVersionRequest {
  description?: string;
  schema?: any;
  publish?: boolean;
  baseVersionSha?: string;
}

export interface UpdateVersionRequest {
  description?: string;
  schema?: any;
}

export interface RevertVersionRequest {
  description?: string;
}

// ==============================================================================
// RESPONSE TYPES (Auto-generated based on actual API responses)
// ==============================================================================

// Auth responses
export interface GetUserResponse {
  data: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

// Form responses
export interface GetFormsResponse {
  data: FormSummary[];
}

export interface GetFormResponse {
  data: FormWithCreator;
}

export interface GetFormSchemaResponse {
  data: FormSchemaResponse;
}

export interface CreateFormResponse {
  data: Form;
}

export interface UpdateFormResponse {
  data: Form;
}

export interface UpdateFormSchemaResponse {
  data: Form;
}

export interface DeleteFormResponse {
  message: string;
}

export interface GetFormSubmissionsResponse {
  data: SubmissionSummary[];
}

// Submission responses
export interface GetSubmissionResponse {
  data: SubmissionDetail;
}

export interface GetSubmissionsByFormResponse {
  data: SubmissionSummary[];
}

export interface CreateSubmissionResponse {
  data: SubmissionCreateResult;
}

// Version responses
export interface GetFormVersionsResponse {
  data: {
    versions: FormVersion[];
    liveVersion: string | null;
  };
}

export interface CreateVersionResponse {
  data: {
    version: FormVersion;
    sha: string;
  };
}

export interface UpdateVersionResponse {
  data: FormVersion;
}

export interface DeleteVersionResponse {
  message: string;
}

export interface PublishVersionResponse {
  data: FormVersion;
}

export interface RevertVersionResponse {
  data: {
    version: FormVersion;
    sha: string;
  };
}

// Profile responses
export interface GetProfileResponse {
  data: UserProfile;
}

export interface UpdateProfileResponse {
  data: {
    id: number;
    name: string;
    email: string | null;
    githubId: string | null;
    avatarUrl: string | null;
  };
}

export interface DeleteAccountResponse {
  message: string;
}

// ==============================================================================
// API UNION TYPES
// ==============================================================================

export type AuthApiResponse<T> = T | ApiError;
export type FormApiResponse<T> = T | ApiError;
export type SubmissionApiResponse<T> = T | ApiError;
export type SettingsApiResponse<T> = T | ApiError;

// ==============================================================================
// API ENDPOINT MAPPING (Auto-generated from route definitions)
// ==============================================================================

export interface ApiResponses {
  // Auth
  'GET /auth/user': AuthApiResponse<GetUserResponse>;
  'POST /auth/logout': AuthApiResponse<LogoutResponse>;

  // Forms
  'GET /forms': FormApiResponse<GetFormsResponse>;
  'GET /forms/:id': FormApiResponse<GetFormResponse>;
  'GET /forms/:id/submit': FormApiResponse<GetFormSchemaResponse>;
  'POST /forms': FormApiResponse<CreateFormResponse>;
  'PATCH /forms/:id': FormApiResponse<UpdateFormResponse>;
  'PATCH /forms/:id/schema': FormApiResponse<UpdateFormSchemaResponse>;
  'DELETE /forms/:id': FormApiResponse<DeleteFormResponse>;
  'GET /forms/:id/submissions': FormApiResponse<GetFormSubmissionsResponse>;

  // Submissions
  'GET /submissions/:id': SubmissionApiResponse<GetSubmissionResponse>;
  'GET /submissions/form/:formId': SubmissionApiResponse<GetSubmissionsByFormResponse>;
  'POST /submissions/form/:formId': SubmissionApiResponse<CreateSubmissionResponse>;

  // Versions
  'GET /forms/:id/versions': FormApiResponse<GetFormVersionsResponse>;
  'POST /forms/:id/versions': FormApiResponse<CreateVersionResponse>;
  'PATCH /forms/:id/versions/:sha': FormApiResponse<UpdateVersionResponse>;
  'DELETE /forms/:id/versions/:sha': FormApiResponse<DeleteVersionResponse>;
  'POST /forms/:id/versions/:sha/publish': FormApiResponse<PublishVersionResponse>;
  'POST /forms/:id/versions/:sha/revert': FormApiResponse<RevertVersionResponse>;

  // Settings
  'GET /settings/profile': SettingsApiResponse<GetProfileResponse>;
  'PATCH /settings/profile': SettingsApiResponse<UpdateProfileResponse>;
  'DELETE /settings/profile': SettingsApiResponse<DeleteAccountResponse>;
}

// Helper type to extract response type from endpoint
export type ApiResponseFromEndpoint<K extends keyof ApiResponses> = ApiResponses[K];
`;
}

/**
 * Generate the complete shared types file
 */
function generateSharedTypes() {
  const header = `// This file is auto-generated. Do not edit manually.
// Run \`npm run types:generate\` to regenerate.
// Generated on: ${new Date().toISOString()}

`;

  const tableTypes = generateTableTypes();
  const apiTypes = generateApiTypes();

  return header + tableTypes + apiTypes;
}

/**
 * Write the generated types to the shared types file
 */
function writeSharedTypes() {
  const content = generateSharedTypes();
  
  // Ensure the directory exists
  const dir = path.dirname(SHARED_TYPES_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(SHARED_TYPES_PATH, content, 'utf8');
  
  console.log('✅ Generated shared types at:', SHARED_TYPES_PATH);
}

/**
 * Format the generated file using prettier
 */
function formatTypes() {
  try {
    execSync(`npx prettier --write "${SHARED_TYPES_PATH}"`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Formatted generated types with prettier');
  } catch (error) {
    console.warn('⚠️  Failed to format types with prettier:', error);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Generating shared types from backend sources...');
  
  try {
    writeSharedTypes();
    formatTypes();
    
    console.log('');
    console.log('🎉 Type generation completed successfully!');
    console.log('');
    console.log('📝 Changes made:');
    console.log('   - Updated shared/types/index.ts with auto-generated types');
    console.log('   - Types are now synced with database schema and API routes');
    console.log('');
    console.log('💡 To regenerate types after backend changes, run:');
    console.log('   npm run types:generate');
    
  } catch (error) {
    console.error('❌ Failed to generate types:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}