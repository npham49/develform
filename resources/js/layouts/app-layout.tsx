import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { Formio } from '@formio/js';
import '@formio/js/dist/formio.full.min.css';
import { FormioProvider } from '@formio/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, hideHeader, ...props }: AppLayoutProps) => (
  <AppLayoutTemplate breadcrumbs={breadcrumbs} hideHeader={hideHeader} {...props}>
    <FormioProvider projectUrl={Formio.projectUrl}>
      <Toaster richColors duration={3000} position="top-right" />
      {children}
    </FormioProvider>
  </AppLayoutTemplate>
);
