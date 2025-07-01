import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import '@tsed/tailwind-formio/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { type ReactNode } from 'react';

// Initialize Formio with Tailwind templates
import '@/lib/formio-tailwind-setup';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
  <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
    <Toaster />
    {children}
  </AppLayoutTemplate>
);
