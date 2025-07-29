import { Hono } from 'hono'

export const webRoutes = new Hono()

// All web routes will be handled by React Router
// This is just a placeholder for future server-side rendering if needed
webRoutes.get('/', (c) => c.redirect('/dashboard'))
webRoutes.get('/dashboard', (c) => c.html('<!-- React App -->'))
webRoutes.get('/forms/*', (c) => c.html('<!-- React App -->'))
webRoutes.get('/auth/*', (c) => c.html('<!-- React App -->'))