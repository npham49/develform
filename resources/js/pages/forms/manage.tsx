import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader>
          <CardTitle>Manage Form: {form.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Form Details</h3>
              <div className="mt-2 space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {form.name}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {form.description || 'No description'}
                </div>
                <div>
                  <span className="font-medium">Public:</span> {form.is_public ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(form.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(form.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Link as="a" href={route('forms.schema', form.id)}>
                <Button variant={'outline'}>Edit Schema</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
