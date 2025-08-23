import { type FormType } from '@formio/react';

export interface Form {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  schema: FormType | null;
  createdAt: string;
  updatedAt: string;
}
