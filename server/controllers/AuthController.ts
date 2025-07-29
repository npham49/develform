import { Context } from 'hono'
import { sign, verify } from 'hono/jwt'
import { prisma } from '../lib/db'
import { hashPassword, verifyPassword } from '../lib/utils'

export class AuthController {
  // Register a new user
  static async register(c: Context) {
    try {
      const body = await c.req.json()
      const { name, email, password } = body

      if (!name || !email || !password) {
        return c.json({ error: 'Name, email, and password are required' }, 400)
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return c.json({ error: 'User already exists' }, 409)
      }

      // Hash password and create user
      const hashedPassword = hashPassword(password)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      })

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'your-secret-key'
      const token = await sign(
        { 
          userId: user.id, 
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
        },
        secret
      )

      return c.json({ 
        user, 
        token,
        message: 'User registered successfully' 
      }, 201)
    } catch (error) {
      console.error('Error registering user:', error)
      return c.json({ error: 'Failed to register user' }, 500)
    }
  }

  // Login user
  static async login(c: Context) {
    try {
      const body = await c.req.json()
      const { email, password } = body

      if (!email || !password) {
        return c.json({ error: 'Email and password are required' }, 400)
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user || !verifyPassword(password, user.password)) {
        return c.json({ error: 'Invalid credentials' }, 401)
      }

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'your-secret-key'
      const token = await sign(
        { 
          userId: user.id, 
          email: user.email,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
        },
        secret
      )

      return c.json({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }, 
        token,
        message: 'Login successful' 
      })
    } catch (error) {
      console.error('Error logging in user:', error)
      return c.json({ error: 'Failed to login' }, 500)
    }
  }

  // Get current user
  static async me(c: Context) {
    try {
      const user = c.get('user')
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!fullUser) {
        return c.json({ error: 'User not found' }, 404)
      }

      return c.json({ user: fullUser })
    } catch (error) {
      console.error('Error fetching user:', error)
      return c.json({ error: 'Failed to fetch user' }, 500)
    }
  }

  // Logout user (client should remove token)
  static async logout(c: Context) {
    return c.json({ message: 'Logged out successfully' })
  }
}