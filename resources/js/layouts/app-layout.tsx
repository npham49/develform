import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import '@formio/js/dist/formio.full.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { type ReactNode } from 'react';

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
