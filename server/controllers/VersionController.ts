import { Context } from 'hono'
import { z } from 'zod'

// Mock data for versions (in production, this would use Prisma)
const mockVersions: any[] = [
  {
    id: 1,
    form_id: 1,
    version_number: 1,
    title: 'Initial Version',
    description: 'First version of the form',
    data: { fields: [] },
    differences: null,
    is_live: true,
    created_by: 1,
    updated_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    form_id: 1,
    version_number: 2,
    title: 'Updated Fields',
    description: 'Added validation to form fields',
    data: { fields: [{ type: 'text', label: 'Name', required: true }] },
    differences: {
      created: ['Name field'],
      updated: [],
      deleted: []
    },
    is_live: false,
    created_by: 1,
    updated_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

// Validation schemas
const createVersionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  based_on: z.number().min(1),
})

const updateVersionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  data: z.any().optional(),
})

export class VersionController {
  // Get all versions for a form
  static async getAllFormVersions(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      if (!formId) {
        return c.json({ error: 'Form ID is required' }, 400)
      }

      const versions = mockVersions.filter(v => v.form_id === formId)
      
      return c.json({ versions })
    } catch (error) {
      console.error('Error fetching form versions:', error)
      return c.json({ error: 'Failed to fetch versions' }, 500)
    }
  }

  // Get a specific version
  static async getVersion(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      const versionId = Number(c.req.param('versionId'))
      
      if (!formId || !versionId) {
        return c.json({ error: 'Form ID and Version ID are required' }, 400)
      }

      const version = mockVersions.find(v => v.id === versionId && v.form_id === formId)
      
      if (!version) {
        return c.json({ error: 'Version not found' }, 404)
      }

      return c.json({ version })
    } catch (error) {
      console.error('Error fetching version:', error)
      return c.json({ error: 'Failed to fetch version' }, 500)
    }
  }

  // Create a new version
  static async createVersion(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      if (!formId) {
        return c.json({ error: 'Form ID is required' }, 400)
      }

      const body = await c.req.json()
      const validationResult = createVersionSchema.safeParse(body)
      
      if (!validationResult.success) {
        return c.json({ 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        }, 400)
      }

      const { title, description, based_on } = validationResult.data

      // Find the base version
      const baseVersion = mockVersions.find(v => v.id === based_on && v.form_id === formId)
      if (!baseVersion) {
        return c.json({ error: 'Base version not found' }, 404)
      }

      // Create new version
      const newVersion = {
        id: mockVersions.length + 1,
        form_id: formId,
        version_number: mockVersions.filter(v => v.form_id === formId).length + 1,
        title,
        description: description || '',
        data: baseVersion.data, // Copy data from base version
        differences: {
          created: [],
          updated: [],
          deleted: []
        },
        is_live: false,
        created_by: 1, // Mock user ID
        updated_by: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockVersions.push(newVersion)

      return c.json({ 
        version: newVersion, 
        message: 'Version created successfully' 
      }, 201)
    } catch (error) {
      console.error('Error creating version:', error)
      return c.json({ error: 'Failed to create version' }, 500)
    }
  }

  // Update a version
  static async updateVersion(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      const versionId = Number(c.req.param('versionId'))
      
      if (!formId || !versionId) {
        return c.json({ error: 'Form ID and Version ID are required' }, 400)
      }

      const versionIndex = mockVersions.findIndex(v => v.id === versionId && v.form_id === formId)
      
      if (versionIndex === -1) {
        return c.json({ error: 'Version not found' }, 404)
      }

      const version = mockVersions[versionIndex]

      // Check if version is live
      if (version.is_live) {
        return c.json({ error: 'Cannot update a live version' }, 400)
      }

      const body = await c.req.json()
      const validationResult = updateVersionSchema.safeParse(body)
      
      if (!validationResult.success) {
        return c.json({ 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        }, 400)
      }

      // Update the version
      const updatedData = validationResult.data
      mockVersions[versionIndex] = {
        ...version,
        ...updatedData,
        updated_by: 1, // Mock user ID
        updated_at: new Date().toISOString(),
      }

      return c.json({ 
        version: mockVersions[versionIndex], 
        message: 'Version updated successfully' 
      })
    } catch (error) {
      console.error('Error updating version:', error)
      return c.json({ error: 'Failed to update version' }, 500)
    }
  }

  // Get version schema for form builder
  static async getVersionSchema(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      const versionId = Number(c.req.param('versionId'))
      
      if (!formId || !versionId) {
        return c.json({ error: 'Form ID and Version ID are required' }, 400)
      }

      const version = mockVersions.find(v => v.id === versionId && v.form_id === formId)
      
      if (!version) {
        return c.json({ error: 'Version not found' }, 404)
      }

      return c.json({ 
        schema: version.data || { fields: [] },
        name: version.title,
        form_id: formId,
        version_id: versionId,
        is_live: version.is_live
      })
    } catch (error) {
      console.error('Error fetching version schema:', error)
      return c.json({ error: 'Failed to fetch version schema' }, 500)
    }
  }

  // Make a version live
  static async makeVersionLive(c: Context) {
    try {
      const formId = Number(c.req.param('formId'))
      const versionId = Number(c.req.param('versionId'))
      
      if (!formId || !versionId) {
        return c.json({ error: 'Form ID and Version ID are required' }, 400)
      }

      const versionIndex = mockVersions.findIndex(v => v.id === versionId && v.form_id === formId)
      
      if (versionIndex === -1) {
        return c.json({ error: 'Version not found' }, 404)
      }

      // Set all other versions of this form to not live
      mockVersions.forEach((v, index) => {
        if (v.form_id === formId) {
          mockVersions[index] = { ...v, is_live: false }
        }
      })

      // Set this version to live
      mockVersions[versionIndex] = {
        ...mockVersions[versionIndex],
        is_live: true,
        updated_by: 1, // Mock user ID
        updated_at: new Date().toISOString(),
      }

      return c.json({ 
        version: mockVersions[versionIndex], 
        message: 'Version is now live' 
      })
    } catch (error) {
      console.error('Error making version live:', error)
      return c.json({ error: 'Failed to make version live' }, 500)
    }
  }
}