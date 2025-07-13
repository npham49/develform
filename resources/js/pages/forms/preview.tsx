import AppLayout from '@/layouts/app-layout';
import { INITIAL_SCHEMA } from '@/lib/constants';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { Webform } from '@formio/js';
import { Form as FormioForm, FormType, Submission } from '@formio/react';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'sonner';

interface FormsPreviewProps {
  form: Form;
}

export default function FormsPreview({ form }: FormsPreviewProps) {
  const formSchema = useRef<FormType>(JSON.parse(form.schema ?? '{}') ?? INITIAL_SCHEMA);
  const previewRef = useRef<Webform>(null);
  const [formReady, setFormReady] = useState(false);

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
      title: 'Preview',
      href: route('forms.preview', form.id),
    },
  ];

  const handleSubmit = (submission: Submission) => {
    if (previewRef.current) {
      previewRef.current.emit('submitDone', submission);
      console.log(submission);
      toast.success('PREVIEW: Form submitted successfully');
    }
  };

  const handleFormReady = (form: Webform) => {
    previewRef.current = form;
  };

  useEffect(() => {
    setFormReady(true);

    return () => {
      formSchema.current = INITIAL_SCHEMA;
      previewRef.current = null;
      setFormReady(false);
    };
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Schema ${form.name}`} />
      <Card>
        <Card.Header>
          <h5 className="card-title mb-0">Preview: {form.name}</h5>
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
              {/* Go back to schema */}
              <Link href={route('forms.schema', form.id)}>
                <Button variant="primary">Go back to schema</Button>
              </Link>
            </div>
            {formReady && (
              <Card>
                <Card.Header>
                  <h5 className="card-title mb-0">{form.name}</h5>
                </Card.Header>
                <Card.Body>
                  <FormioForm src={formSchema.current} onSubmit={handleSubmit} onFormReady={handleFormReady} />
                </Card.Body>
              </Card>
            )}
          </div>
        </Card.Body>
      </Card>
    </AppLayout>
  );
}
