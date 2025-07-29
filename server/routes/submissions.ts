import { Hono } from 'hono'
import { SubmissionController } from '../controllers/SubmissionController'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth'

export const submissionRoutes = new Hono()

// Public/optional auth routes
submissionRoutes.post('/forms/:formId', optionalAuthMiddleware, SubmissionController.store)
submissionRoutes.get('/forms/:formId/submissions/:submissionId/success', SubmissionController.success)

// Protected routes (require authentication)
submissionRoutes.get('/forms/:formId', authMiddleware, SubmissionController.index)
submissionRoutes.get('/:id', authMiddleware, SubmissionController.show)