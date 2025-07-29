import { QueryClient } from '@tanstack/react-query'

// Import route components
import { Route as rootRoute } from './routes/__root'
import { Route as indexRoute } from './routes/index'
import { Route as dashboardRoute } from './routes/dashboard'
import { Route as formsRoute } from './routes/forms'
import { Route as formsCreateRoute } from './routes/forms/create'
import { Route as formManageRoute } from './routes/forms/$formId/manage'
import { Route as loginRoute } from './routes/auth/login'
import { Route as registerRoute } from './routes/auth/register'

// Create route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  formsRoute,
  formsCreateRoute,
  formManageRoute,
  loginRoute,
  registerRoute,
])

// Types
export interface RouterContext {
  queryClient: QueryClient
}