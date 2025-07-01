import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  return (
    <AppShell variant="header">
      <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', fontSize: '20px', textAlign: 'center' }}>
        HEADER LAYOUT IS ACTIVE - TOP NAVIGATION
      </div>
      <AppHeader breadcrumbs={breadcrumbs} />
      <AppContent variant="header" className="flex-fill overflow-x-hidden">
        {children}
      </AppContent>
    </AppShell>
  );
}
