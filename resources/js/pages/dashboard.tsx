import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="gap-4 rounded-xl p-4 flex h-full flex-1 flex-col overflow-x-auto">
        <div className="gap-4 md:grid-cols-3 grid auto-rows-min">
          <div className="aspect-video rounded-xl border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden border">
            <PlaceholderPattern className="inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 absolute size-full" />
          </div>
          <div className="aspect-video rounded-xl border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden border">
            <PlaceholderPattern className="inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 absolute size-full" />
          </div>
          <div className="aspect-video rounded-xl border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden border">
            <PlaceholderPattern className="inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 absolute size-full" />
          </div>
        </div>
        <div className="rounded-xl border-sidebar-border/70 md:min-h-min dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden border">
          <PlaceholderPattern className="inset-0 stroke-neutral-900/20 dark:stroke-neutral-100/20 absolute size-full" />
        </div>
      </div>
    </AppLayout>
  );
}
