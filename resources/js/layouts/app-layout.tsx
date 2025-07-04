import AppLayoutTemplate from '@/layouts/app/app-header-layout';
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
    {/* Toast notifications will be implemented here */}
    <div id="toast-container" className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}></div>
    {children}
  </AppLayoutTemplate>
);
