import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { Head, Link } from '@inertiajs/react';

interface FormsManageProps {
  form: Form;
}

export default function FormsManage({ form }: FormsManageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Forms',
      href: route('forms.index'),
    },
    {
      title: form.name,
      href: route('forms.manage', form.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Manage ${form.name}`} />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Manage Form: {form.name}</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column gap-4">
            <div>
              <h3 className="fs-4 fw-semibold">Form Details</h3>
              <div className="mt-2 d-flex flex-column gap-2">
                <div>
                  <span className="fw-medium">Name:</span> {form.name}
                </div>
                <div>
                  <span className="fw-medium">Description:</span> {form.description || 'No description'}
                </div>
                <div>
                  <span className="fw-medium">Public:</span> {form.is_public ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="fw-medium">Created:</span> {new Date(form.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="fw-medium">Last Updated:</span> {new Date(form.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Link as="a" href={route('forms.schema', form.id)}>
                <button className="btn btn-outline-secondary">Edit Schema</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
