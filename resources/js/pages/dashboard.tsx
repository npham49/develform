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
      <div className="gap-4 rounded p-4 d-flex h-100 flex-1 flex-column overflow-x-auto">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="rounded border position-relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <PlaceholderPattern className="position-absolute top-0 start-0 w-100 h-100" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="rounded border position-relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <PlaceholderPattern className="position-absolute top-0 start-0 w-100 h-100" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="rounded border position-relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <PlaceholderPattern className="position-absolute top-0 start-0 w-100 h-100" />
            </div>
          </div>
        </div>
        <div className="rounded border position-relative flex-fill overflow-hidden" style={{ minHeight: '50vh' }}>
          <PlaceholderPattern className="position-absolute top-0 start-0 w-100 h-100" />
        </div>
      </div>
    </AppLayout>
  );
}
