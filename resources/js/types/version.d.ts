export interface Version {
  id: number;
  form_id: number;
  version_number: number;
  title: string;
  description: string;
  data: string | null;
  differences: string | null;
  is_live: boolean;
  created_at: string;
  updated_at: string;
}