import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
  return (
    <header className="d-flex h-16 align-items-center gap-2 border-bottom px-4">
      <div className="d-flex align-items-center gap-2">
        <SidebarTrigger className="ms-n1" />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </header>
  );
}
