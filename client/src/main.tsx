import { Formio } from '@formio/js';
import '@formio/js/dist/formio.full.min.css';
import { FormioProvider } from '@formio/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import { AuthProvider } from './hooks/useAuth';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Initialize theme
initializeTheme();

// Create a query client
const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FormioProvider projectUrl={Formio.projectUrl}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </FormioProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
