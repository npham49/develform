import { Hono } from 'hono'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware } from '../middleware/auth'

export const authRoutes = new Hono()

// Public routes
authRoutes.post('/register', AuthController.register)
authRoutes.post('/login', AuthController.login)

// Protected routes
authRoutes.get('/me', authMiddleware, AuthController.me)
authRoutes.post('/logout', authMiddleware, AuthController.logout)