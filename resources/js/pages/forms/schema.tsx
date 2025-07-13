import AppLayout from '@/layouts/app-layout';
import { INITIAL_SCHEMA } from '@/lib/constants';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { FormBuilder, type FormType } from '@formio/react';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { toast } from 'sonner';

interface FormsSchemaProps {
  form: Form;
}

export default function FormsSchema({ form }: FormsSchemaProps) {
  const initialBuilderSchema = useRef<FormType>(JSON.parse(form.schema ?? '{}') ?? INITIAL_SCHEMA);
  const [schema, setSchema] = useState<FormType>(initialBuilderSchema.current);
  const [processing, setProcessing] = useState(false);
  const [builderReady, setBuilderReady] = useState(false);

  const handleUpdateSchema = () => {
    router.post(
      route('forms.schema.update', form.id),
      {
        schema: JSON.stringify(schema),
      },
      {
        onStart: () => {
          setProcessing(true);
        },
        onSuccess: () => {
          toast.success('Schema updated successfully');
          setProcessing(false);
        },
        onError: (error) => {
          console.log(error);
          toast.error('Failed to update schema', {
            description: error.response,
          });
          setProcessing(false);
        },
      },
    );
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
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

  useEffect(() => {
    setBuilderReady(true);
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Schema ${form.name}`} />
      <Card>
        <Card.Header>
          <h5 className="card-title mb-0">Schema: {form.name}</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-column gap-4">
            <div>
              <h3 className="fs-5 fw-semibold">Form Details</h3>
              <div className="mt-2 d-flex flex-column gap-2">
                <div>
                  <span className="fw-medium">Name:</span> {form.name}
                </div>
              </div>
              <Button variant="primary" onClick={handleUpdateSchema} disabled={processing}>
                Save
              </Button>
              <Link href={route('forms.preview', form.id)}>
                <Button variant="primary">Preview</Button>
              </Link>
            </div>
            <div className="p-4 bg-light rounded border">
              {builderReady && <FormBuilder initialForm={initialBuilderSchema.current} onChange={(form) => setSchema(form)} />}
            </div>
          </div>
        </Card.Body>
      </Card>
    </AppLayout>
  );
}
