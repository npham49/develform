import { Head } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Appearance settings',
    href: '/settings/appearance',
  },
];

export default function Appearance() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Appearance settings" />

      <SettingsLayout>
        <div className="d-flex flex-column gap-4">
          <div className="mb-4">
            <h4 className="fw-semibold">Appearance settings</h4>
            <p className="text-muted mb-0">Update your account's appearance settings</p>
          </div>
          <div className="p-4 bg-light rounded border">
            <p className="text-muted mb-0">Appearance settings will be implemented here</p>
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
