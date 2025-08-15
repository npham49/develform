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
    getUser: () => this.request<{ user: any }>('/auth/user'),
    logout: () => this.request<{ message: string }>('/auth/logout', { method: 'POST' }),
  };

  // Forms methods
  forms = {
    list: () => this.request<{ data: any[] }>('/forms'),
    get: (id: number) => this.request<{ data: any }>(`/forms/${id}`),
    getSubmitSchema: (id: number) => this.request<{ data: any }>(`/forms/${id}/submit`),
    create: (data: any) => this.request<{ data: any }>('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => this.request<{ data: any }>(`/forms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    delete: (id: number) => this.request<{ message: string }>(`/forms/${id}`, {
      method: 'DELETE',
    }),
  };

  // Submissions methods
  submissions = {
    create: (data: any) => this.request<{ data: any }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    get: (id: number, token?: string) => {
      const params = token ? `?token=${token}` : '';
      return this.request<{ data: any }>(`/submissions/${id}${params}`);
    },
    getByForm: (formId: number) => this.request<{ data: any[] }>(`/submissions/form/${formId}`),
  };

  // Settings methods
  settings = {
    getProfile: () => this.request<{ data: any }>('/settings/profile'),
    updateProfile: (data: any) => this.request<{ data: any }>('/settings/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    deleteAccount: () => this.request<{ message: string }>('/settings/profile', {
      method: 'DELETE',
    }),
  };
}

export const api = new ApiClient();