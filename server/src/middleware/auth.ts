import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';

export const authMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token') || c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(token, process.env.JWT_SECRET || 'your-secret-key');
    c.set('jwtPayload', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token') || c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const payload = await verify(token, process.env.JWT_SECRET || 'your-secret-key');
      c.set('jwtPayload', payload);
    } catch (error) {
      // Token is invalid, but we continue without authentication
      c.set('jwtPayload', null);
    }
  } else {
    c.set('jwtPayload', null);
  }
  
  await next();
};