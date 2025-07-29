import '../css/app.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/query-devtools'
import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import { initializeTheme } from './hooks/use-appearance'
import Dashboard from './pages/dashboard-hono'

// Create a simple root route
const rootRoute = createRootRoute({
  component: () => <Dashboard />, 
})

// Create route tree
const routeTree = rootRoute

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

// Create the router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

// Always try to mount the app
const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
)

// Initialize theme
initializeTheme()