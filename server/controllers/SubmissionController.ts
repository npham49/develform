import { Context } from 'hono'
import { prisma } from '../lib/db'
import { generateToken } from '../lib/utils'

export class SubmissionController {
  // Store a new submission
  static async store(c: Context) {
    try {
      const formId = c.req.param('formId')
      const userId = c.get('user')?.id
      const body = await c.req.json()
      const { data } = body

      if (!data) {
        return c.json({ error: 'Submission data is required' }, 400)
      }

      // Check if form exists and is accessible
      const form = await prisma.form.findUnique({
        where: { id: Number(formId) }
      })

      if (!form) {
        return c.json({ error: 'Form not found' }, 404)
      }

      // If form is not public, user must be authenticated and own the form
      if (!form.isPublic && (!userId || userId !== form.createdBy)) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // Create the submission
      const submission = await prisma.submission.create({
        data: {
          formId: Number(formId),
          data,
          createdBy: userId,
          updatedBy: userId
        },
        include: {
          form: {
            select: { id: true, name: true }
          },
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      // Generate a token for the submission
      const token = generateToken()
      await prisma.submissionToken.create({
        data: {
          submissionId: submission.id,
          token
        }
      })

      return c.json({ 
        submission, 
        token,
        message: 'Submission created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating submission:', error)
      return c.json({ error: 'Failed to create submission' }, 500)
    }
  }

  // Show success page for a submission
  static async success(c: Context) {
    try {
      const formId = c.req.param('formId')
      const submissionId = c.req.param('submissionId')
      const token = c.req.query('token')

      if (!token) {
        return c.json({ error: 'Token is required' }, 400)
      }

      // Verify the token
      const submissionToken = await prisma.submissionToken.findUnique({
        where: { token },
        include: {
          submission: {
            include: {
              form: {
                select: { id: true, name: true }
              }
            }
          }
        }
      })

      if (!submissionToken || 
          submissionToken.submission.id !== Number(submissionId) ||
          submissionToken.submission.formId !== Number(formId)) {
        return c.json({ error: 'Invalid token or submission' }, 404)
      }

      return c.json({
        submission: submissionToken.submission,
        form: submissionToken.submission.form,
        message: 'Submission completed successfully'
      })
    } catch (error) {
      console.error('Error fetching submission success:', error)
      return c.json({ error: 'Failed to fetch submission' }, 500)
    }
  }

  // Get all submissions for a form (for form owners)
  static async index(c: Context) {
    try {
      const formId = c.req.param('formId')
      const userId = c.get('user')?.id
      
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // Check if user owns the form
      const form = await prisma.form.findUnique({
        where: { id: Number(formId) }
      })

      if (!form || form.createdBy !== userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const page = Number(c.req.query('page')) || 1
      const limit = Number(c.req.query('limit')) || 10
      const skip = (page - 1) * limit

      const [submissions, total] = await Promise.all([
        prisma.submission.findMany({
          where: { formId: Number(formId) },
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.submission.count({
          where: { formId: Number(formId) }
        })
      ])

      return c.json({
        submissions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      })
    } catch (error) {
      console.error('Error fetching submissions:', error)
      return c.json({ error: 'Failed to fetch submissions' }, 500)
    }
  }

  // Get a specific submission
  static async show(c: Context) {
    try {
      const submissionId = c.req.param('id')
      const userId = c.get('user')?.id
      
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const submission = await prisma.submission.findUnique({
        where: { id: Number(submissionId) },
        include: {
          form: {
            select: { id: true, name: true, createdBy: true }
          },
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      if (!submission) {
        return c.json({ error: 'Submission not found' }, 404)
      }

      // Check if user owns the form or the submission
      if (submission.form.createdBy !== userId && submission.createdBy !== userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      return c.json({ submission })
    } catch (error) {
      console.error('Error fetching submission:', error)
      return c.json({ error: 'Failed to fetch submission' }, 500)
    }
  }
}