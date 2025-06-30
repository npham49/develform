export interface Form {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  schema: unknown;
  created_at: string;
  updated_at: string;
}
