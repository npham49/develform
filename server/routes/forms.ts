import { Hono } from 'hono'
import { FormController } from '../controllers/FormController'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth'

export const formRoutes = new Hono()

// Protected routes (require authentication)
formRoutes.get('/', authMiddleware, FormController.index)
formRoutes.post('/', authMiddleware, FormController.store)
formRoutes.get('/:id', authMiddleware, FormController.show)
formRoutes.put('/:id', authMiddleware, FormController.update)
formRoutes.delete('/:id', authMiddleware, FormController.destroy)

// Public/optional auth routes
formRoutes.get('/:id/schema', optionalAuthMiddleware, FormController.getSchema)