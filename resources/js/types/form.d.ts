export interface Form {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  schema: string | null;
  version_id: number;
  created_at: string;
  updated_at: string;
}
