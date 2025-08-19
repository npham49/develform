import type { Context } from 'hono';
import type { User } from '../auth';

export interface AuthContext extends Context {
  get(key: 'user'): User | null;
  get(key: 'session'): any;
}