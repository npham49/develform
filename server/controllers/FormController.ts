import { Context } from 'hono'
import { prisma } from '../lib/db'

export class FormController {
  // Display a listing of forms for the authenticated user
  static async index(c: Context) {
    try {
      const userId = c.get('user')?.id
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const forms = await prisma.form.findMany({
        where: {
          createdBy: userId
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { submissions: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return c.json({ forms })
    } catch (error) {
      console.error('Error fetching forms:', error)
      return c.json({ error: 'Failed to fetch forms' }, 500)
    }
  }

  // Get form schema for public or authenticated access
  static async getSchema(c: Context) {
    try {
      const formId = c.req.param('id')
      const userId = c.get('user')?.id

      const form = await prisma.form.findUnique({
        where: { id: Number(formId) },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      if (!form) {
        return c.json({ error: 'Form not found' }, 404)
      }

      // Check if form is public or user is authenticated
      if (form.isPublic || (userId && userId === form.createdBy)) {
        return c.json({
          schema: form.schema,
          name: form.name,
          form_id: form.id,
          is_public: form.isPublic
        })
      }

      return c.json({ error: 'Unauthorized' }, 401)
    } catch (error) {
      console.error('Error fetching form schema:', error)
      return c.json({ error: 'Failed to fetch form schema' }, 500)
    }
  }

  // Store a newly created form
  static async store(c: Context) {
    try {
      const userId = c.get('user')?.id
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const body = await c.req.json()
      const { name, description, is_public = true } = body

      if (!name) {
        return c.json({ error: 'Name is required' }, 400)
      }

      const form = await prisma.form.create({
        data: {
          name,
          description,
          isPublic: is_public,
          createdBy: userId,
          updatedBy: userId
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      return c.json({ form, message: 'Form created successfully' }, 201)
    } catch (error) {
      console.error('Error creating form:', error)
      return c.json({ error: 'Failed to create form' }, 500)
    }
  }

  // Display the specified form
  static async show(c: Context) {
    try {
      const formId = c.req.param('id')
      const userId = c.get('user')?.id

      const form = await prisma.form.findUnique({
        where: { id: Number(formId) },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          submissions: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
              creator: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: { submissions: true }
          }
        }
      })

      if (!form) {
        return c.json({ error: 'Form not found' }, 404)
      }

      // Check if user owns the form or it's public
      if (!form.isPublic && (!userId || userId !== form.createdBy)) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      return c.json({ form })
    } catch (error) {
      console.error('Error fetching form:', error)
      return c.json({ error: 'Failed to fetch form' }, 500)
    }
  }

  // Update the specified form
  static async update(c: Context) {
    try {
      const formId = c.req.param('id')
      const userId = c.get('user')?.id
      
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const form = await prisma.form.findUnique({
        where: { id: Number(formId) }
      })

      if (!form) {
        return c.json({ error: 'Form not found' }, 404)
      }

      if (form.createdBy !== userId) {
        return c.json({ error: 'You are not authorized to update this form' }, 403)
      }

      const body = await c.req.json()
      const { name, description, is_public, schema } = body

      const updatedForm = await prisma.form.update({
        where: { id: Number(formId) },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(is_public !== undefined && { isPublic: is_public }),
          ...(schema && { schema }),
          updatedBy: userId
        },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      return c.json({ form: updatedForm, message: 'Form updated successfully' })
    } catch (error) {
      console.error('Error updating form:', error)
      return c.json({ error: 'Failed to update form' }, 500)
    }
  }

  // Delete the specified form
  static async destroy(c: Context) {
    try {
      const formId = c.req.param('id')
      const userId = c.get('user')?.id
      
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const form = await prisma.form.findUnique({
        where: { id: Number(formId) }
      })

      if (!form) {
        return c.json({ error: 'Form not found' }, 404)
      }

      if (form.createdBy !== userId) {
        return c.json({ error: 'You are not authorized to delete this form' }, 403)
      }

      await prisma.form.delete({
        where: { id: Number(formId) }
      })

      return c.json({ message: 'Form deleted successfully' })
    } catch (error) {
      console.error('Error deleting form:', error)
      return c.json({ error: 'Failed to delete form' }, 500)
    }
  }
}