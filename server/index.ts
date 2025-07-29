import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

// Import routes
import { authRoutes } from './routes/auth'
import { formRoutes } from './routes/forms'
import { submissionRoutes } from './routes/submissions'
import { webRoutes } from './routes/web'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

// Serve static files
app.use('/public/*', serveStatic({ root: './' }))

// API Routes
app.route('/api/auth', authRoutes)
app.route('/api/forms', formRoutes)
app.route('/api/submissions', submissionRoutes)

// Web routes (for the React app)
app.route('/', webRoutes)

// Default route for React app
app.get('*', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DevelForm</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="/resources/css/app.css" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/resources/js/app-hono.tsx"></script>
      </body>
    </html>
  `)
})

const port = process.env.PORT || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port: Number(port),
})

export default app