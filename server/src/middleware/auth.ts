import type { Context, Next } from 'hono';
import { auth } from '../auth';
import type { User } from '../auth';

declare module 'hono' {
  interface ContextVariableMap {
    user: User | null;
    session: any;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', session.user);
  c.set('session', session);
  await next();
};

export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set('user', session?.user || null);
  c.set('session', session || null);
  await next();
};
