export interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  githubId: string | null;
  avatarUrl: string | null;
}

export interface JWTPayload {
  sub: string;
  user: AuthUser;
  iat: number;
  exp: number;
}

export interface FormSchema {
  components: any[];
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}