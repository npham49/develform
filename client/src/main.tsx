import { Formio } from '@formio/js';
import '@formio/js/dist/formio.full.min.css';
import { FormioProvider } from '@formio/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App';
import './css/app.css';
import { initializeTheme } from './hooks/use-appearance';
import { AuthProvider } from './hooks/useAuth';

// Initialize theme
initializeTheme();

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <FormioProvider projectUrl={Formio.projectUrl}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster richColors duration={3000} position="top-right" />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </FormioProvider>
  </React.StrictMode>,
);
