import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { FormBuilder } from '@formio/react';
import { Head } from '@inertiajs/react';

interface FormsSchemaProps {
  form: Form;
}

export default function FormsSchema({ form }: FormsSchemaProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Forms',
      href: route('forms.index'),
    },
    {
      title: form.name,
      href: route('forms.manage', form.id),
    },
    {
      title: 'Schema',
      href: route('forms.schema', form.id),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Schema ${form.name}`} />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Schema: {form.name}</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column gap-4">
            <div>
              <h3 className="fs-5 fw-semibold">Form Details</h3>
              <div className="mt-2 d-flex flex-column gap-2">
                <div>
                  <span className="fw-medium">Name:</span> {form.name}
                </div>
              </div>
            </div>
            <div className="p-4 bg-light rounded border">
              <p className="text-muted">Form Builder will be implemented here</p>
              <FormBuilder />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
