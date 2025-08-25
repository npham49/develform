// Re-export all shared types for backwards compatibility and convenience
export * from '@develform/shared-types';

// Import FormType for proper type integration
import { FormType } from '@formio/react';

// Client-specific type extensions that augment shared types with FormType specificity
// These override the generic 'any' types in shared with proper FormType

export interface FormSchemaWithFormType {
  id: number;
  name: string;
  schema: FormType | undefined;
  versionSha: string | null;
}

export interface FormWithFormType {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  schema: FormType | undefined;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormWithCreatorWithFormType extends FormWithFormType {
  creator: {
    id: number;
    name: string;
  } | null;
}

export interface FormVersionWithFormType {
  id: number;
  versionSha: string;
  schema: FormType | undefined;
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

export interface FormVersionWithSchemaWithFormType extends FormVersionWithFormType {
  schema: FormType;
}
