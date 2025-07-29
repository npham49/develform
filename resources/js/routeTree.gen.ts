import { createRoute, createRootRoute } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

// Import route components
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as dashboardRoute } from './routes/dashboard'

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
])

// Types
export interface RouterContext {
  queryClient: QueryClient
}