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
            <div
              className="rounded border position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center"
              style={{ aspectRatio: '16/9' }}
            >
              <span className="text-muted">Dashboard Widget</span>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="rounded border position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center"
              style={{ aspectRatio: '16/9' }}
            >
              <span className="text-muted">Dashboard Widget</span>
            </div>
          </div>
          <div className="col-md-4">
            <div
              className="rounded border position-relative overflow-hidden bg-light d-flex align-items-center justify-content-center"
              style={{ aspectRatio: '16/9' }}
            >
              <span className="text-muted">Dashboard Widget</span>
            </div>
          </div>
        </div>
        <div
          className="rounded border position-relative flex-fill overflow-hidden bg-light d-flex align-items-center justify-content-center"
          style={{ minHeight: '50vh' }}
        >
          <span className="text-muted">Main Dashboard Content</span>
        </div>
      </div>
    </AppLayout>
  );
}
