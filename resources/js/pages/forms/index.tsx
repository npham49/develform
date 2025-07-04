import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Form {
  id: number;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface FormsIndexProps {
  forms: Form[];
}

export default function FormsIndex({ forms }: FormsIndexProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: '/forms',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Forms" />
      <div className="gap-4 rounded p-4 d-flex h-100 flex-1 flex-column overflow-x-auto">
        <Link as="a" href={route('forms.create')} className="ms-auto">
          <button className="btn btn-outline-secondary">Create Form</button>
        </Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="text-start">Name</th>
              <th className="text-start">Description</th>
              <th className="text-start">Public</th>
              <th className="text-start">Created At</th>
              <th className="text-start">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td>{form.name}</td>
                <td>{form.description || 'No description'}</td>
                <td>{form.is_public ? 'Yes' : 'No'}</td>
                <td>{new Date(form.created_at).toLocaleDateString()}</td>
                <td>
                  <Link href={route('forms.manage', form.id)}>
                    <button className="btn btn-outline-secondary btn-sm">Manage</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {forms.length === 0 && <div className="py-4 text-muted text-center">No forms found. Create your first form to get started.</div>}
      </div>
    </AppLayout>
  );
}
