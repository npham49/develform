// Shared type definitions between client and server
// This ensures type consistency across the API boundary

import { z } from 'zod';

// ==============================================================================
// BASIC TYPES
// ==============================================================================

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

// ==============================================================================
// USER & AUTH TYPES
// ==============================================================================

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

export interface JWTPayload {
  sub: string;
  user: AuthUser;
  iat: number;
  exp: number;
}

// ==============================================================================
// FORM TYPES
// ==============================================================================

// Basic form schema interface - keeping generic to support FormType from @formio/react
export interface FormSchema {
  components: any[];
  [key: string]: any;
}

export interface FormSummary {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Form {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  schema: any; // FormType from @formio/react
  createdBy: number;
  updatedBy: number;
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

// ==============================================================================
// VERSION TYPES
// ==============================================================================

export interface FormVersion {
  id: number;
  versionSha: string;
  schema: any; // FormType from @formio/react
  description: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  metadata: {
    baseVersionSha: string | null;
    auditDescription: string | null;
    createdAt: string;
    operation: 'initial' | 'derived';
  } | null;
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

// ==============================================================================
// SUBMISSION TYPES
// ==============================================================================

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

// ==============================================================================
// REQUEST TYPES
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
// RESPONSE TYPES
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
// API ENDPOINT MAPPING
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
