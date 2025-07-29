import { Context, Next } from 'hono'
import { verify } from 'hono/jwt'
import { prisma } from '../lib/db'

export async function authMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    
    const payload = await verify(token, secret)
    
    if (!payload || !payload.userId) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401)
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    if (!user) {
      return c.json({ error: 'Unauthorized - User not found' }, 401)
    }

    // Set user in context
    c.set('user', user)
    
    await next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return c.json({ error: 'Unauthorized - Invalid token' }, 401)
  }
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const secret = process.env.JWT_SECRET || 'your-secret-key'
      
      try {
        const payload = await verify(token, secret)
        
        if (payload && payload.userId) {
          const user = await prisma.user.findUnique({
            where: { id: payload.userId as number },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true
            }
          })

          if (user) {
            c.set('user', user)
          }
        }
      } catch (tokenError) {
        // Invalid token, but we continue without user
        console.log('Invalid token in optional auth:', tokenError)
      }
    }
    
    await next()
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    await next()
  }
}