const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token')

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

export const getAuthToken = () => authToken

// Base API function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options.headers,
    },
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      error: `HTTP ${response.status}: ${response.statusText}` 
    }))
    throw new Error(error.error || 'An error occurred')
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ user: any; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest<{ user: any; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  me: () =>
    apiRequest<{ user: any }>('/auth/me'),

  logout: () =>
    apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
}

// Forms API
export const formsApi = {
  getAll: () =>
    apiRequest<{ forms: any[] }>('/forms'),

  getById: (id: number) =>
    apiRequest<{ form: any }>(`/forms/${id}`),

  getSchema: (id: number) =>
    apiRequest<{ schema: any; name: string; form_id: number; is_public: boolean }>(`/forms/${id}/schema`),

  create: (formData: { name: string; description?: string; is_public?: boolean }) =>
    apiRequest<{ form: any; message: string }>('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  update: (id: number, formData: any) =>
    apiRequest<{ form: any; message: string }>(`/forms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    }),

  delete: (id: number) =>
    apiRequest<{ message: string }>(`/forms/${id}`, {
      method: 'DELETE',
    }),
}

// Submissions API
export const submissionsApi = {
  getByFormId: (formId: number, page = 1, limit = 10) =>
    apiRequest<{ submissions: any[]; pagination: any }>(`/submissions/forms/${formId}?page=${page}&limit=${limit}`),

  getById: (id: number) =>
    apiRequest<{ submission: any }>(`/submissions/${id}`),

  create: (formId: number, data: any) =>
    apiRequest<{ submission: any; token: string; message: string }>(`/submissions/forms/${formId}`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    }),

  getSuccess: (formId: number, submissionId: number, token: string) =>
    apiRequest<{ submission: any; form: any; message: string }>(`/submissions/forms/${formId}/submissions/${submissionId}/success?token=${token}`),
}