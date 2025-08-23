import type {
  CreateFormRequest,
  CreateFormResponse,
  CreateSubmissionResponse,
  DeleteAccountResponse,
  DeleteFormResponse,
  GetFormResponse,
  GetFormSchemaResponse,
  GetFormsResponse,
  GetFormSubmissionsResponse,
  GetProfileResponse,
  GetSubmissionResponse,
  GetSubmissionsByFormResponse,
  GetUserResponse,
  LogoutResponse,
  UpdateFormRequest,
  UpdateFormResponse,
  UpdateFormSchemaRequest,
  UpdateFormSchemaResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '../types/api';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  auth = {
    getUser: () => this.request<GetUserResponse>('/auth/user'),
    logout: () => this.request<LogoutResponse>('/auth/logout', { method: 'POST' }),
  };

  // Forms methods
  forms = {
    list: () => this.request<GetFormsResponse>('/forms'),
    get: (id: number) => this.request<GetFormResponse>(`/forms/${id}`),
    getSubmitSchema: (id: number) => this.request<GetFormSchemaResponse>(`/forms/${id}/submit`),
    create: (data: CreateFormRequest) =>
      this.request<CreateFormResponse>('/forms', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: UpdateFormRequest) =>
      this.request<UpdateFormResponse>(`/forms/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateSchema: (id: number, data: UpdateFormSchemaRequest) =>
      this.request<UpdateFormSchemaResponse>(`/forms/${id}/schema`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      this.request<DeleteFormResponse>(`/forms/${id}`, {
        method: 'DELETE',
      }),
    getSubmissions: (id: number) => this.request<GetFormSubmissionsResponse>(`/forms/${id}/submissions`),
  };

  // Submissions methods
  submissions = {
    submitToForm: (formId: number, data: unknown) =>
      this.request<CreateSubmissionResponse>(`/submissions/form/${formId}`, {
        method: 'POST',
        body: JSON.stringify({ formId, data }),
      }),
    get: (id: number, token?: string) => {
      const params = token ? `?token=${token}` : '';
      return this.request<GetSubmissionResponse>(`/submissions/${id}${params}`);
    },
    getByForm: (formId: number) => this.request<GetSubmissionsByFormResponse>(`/submissions/form/${formId}`),
  };

  // Settings methods
  settings = {
    getProfile: () => this.request<GetProfileResponse>('/settings/profile'),
    updateProfile: (data: UpdateProfileRequest) =>
      this.request<UpdateProfileResponse>('/settings/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    deleteAccount: () =>
      this.request<DeleteAccountResponse>('/settings/profile', {
        method: 'DELETE',
      }),
  };
}

export const api = new ApiClient();
