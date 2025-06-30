import { Button } from '@/components/ui/button';
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
      <div className="gap-4 rounded-xl p-4 flex h-full flex-1 flex-col overflow-x-auto">
        <Link as="a" href={route('forms.create')} className="ml-auto">
          <Button className="cursor-pointer" variant={'outline'}>
            Create Form
          </Button>
        </Link>
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Public</th>
              <th className="p-2 text-left">Created At</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id} className="hover:bg-gray-50 border-b">
                <td className="p-2">{form.name}</td>
                <td className="p-2">{form.description || 'No description'}</td>
                <td className="p-2">{form.is_public ? 'Yes' : 'No'}</td>
                <td className="p-2">{new Date(form.created_at).toLocaleDateString()}</td>
                <td className="p-2">
                  <Link href={route('forms.manage', form.id)}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {forms.length === 0 && <div className="py-8 text-gray-500 text-center">No forms found. Create your first form to get started.</div>}
      </div>
    </AppLayout>
  );
}
