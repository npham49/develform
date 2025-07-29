#!/usr/bin/env bun

/**
 * Development Server for DevelForm Hono App
 * This script starts the Hono server with mock data for testing
 */

import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

// Serve static files
app.use('/public/*', serveStatic({ root: './' }))
app.use('/resources/*', serveStatic({ root: './' }))

// Mock data for development
const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
}

const mockForms = [
  {
    id: 1,
    name: 'Contact Form',
    description: 'A simple contact form',
    isPublic: true,
    schema: { fields: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: mockUser,
    _count: { submissions: 5 }
  },
  {
    id: 2,
    name: 'Feedback Form',
    description: 'Customer feedback collection',
    isPublic: false,
    schema: { fields: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: mockUser,
    _count: { submissions: 12 }
  }
]

// Mock API routes
app.get('/api/auth/me', (c) => {
  return c.json({ user: mockUser })
})

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json()
  return c.json({
    user: mockUser,
    token: 'mock-jwt-token',
    message: 'Login successful'
  })
})

app.post('/api/auth/register', async (c) => {
  const body = await c.req.json()
  return c.json({
    user: { ...mockUser, name: body.name, email: body.email },
    token: 'mock-jwt-token',
    message: 'Registration successful'
  })
})

app.get('/api/forms', (c) => {
  return c.json({ forms: mockForms })
})

app.get('/api/forms/:id', (c) => {
  const id = c.req.param('id')
  const form = mockForms.find(f => f.id === Number(id))
  if (!form) {
    return c.json({ error: 'Form not found' }, 404)
  }
  return c.json({ form })
})

app.post('/api/forms', async (c) => {
  const body = await c.req.json()
  const newForm = {
    id: mockForms.length + 1,
    ...body,
    isPublic: body.is_public ?? true,
    schema: { fields: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: mockUser,
    _count: { submissions: 0 }
  }
  mockForms.push(newForm)
  return c.json({ form: newForm, message: 'Form created successfully' }, 201)
})

// Default route for React app
app.get('*', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevelForm - Development Mode</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
          .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="gradient-bg d-flex align-items-center justify-content-center" style="min-height: 100vh;">
            <div class="text-center text-white">
              <div class="spinner-border mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h3>Loading DevelForm...</h3>
              <p class="opacity-75">Development mode with mock data</p>
            </div>
          </div>
        </div>
        <script type="module" src="/resources/js/app-hono.tsx"></script>
      </body>
    </html>
  `)
})

const port = process.env.PORT || 8080
console.log(`🚀 DevelForm Development Server starting on port ${port}`)
console.log(`📝 Mode: Development with mock data`)
console.log(`🌐 Frontend: http://localhost:${port}`)
console.log(`🔧 API: http://localhost:${port}/api`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app