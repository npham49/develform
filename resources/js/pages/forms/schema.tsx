import AppLayout from '@/layouts/app-layout';
import { INITIAL_SCHEMA } from '@/lib/constants';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { FormBuilder, type FormType } from '@formio/react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Code, Eye, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { toast } from 'sonner';

interface FormsSchemaProps {
  form: Form;
}

export default function FormsSchema({ form }: FormsSchemaProps) {
  const [schema, setSchema] = useState<FormType | null>(null);
  const [processing, setProcessing] = useState(false);
  const [builderReady, setBuilderReady] = useState(false);

  const handleUpdateSchema = () => {
    if (!schema) return;
    setProcessing(true);

    router.patch(
      route('forms.schema.update', form.id),
      { schema: JSON.stringify(schema) },
      {
        onSuccess: () => {
          toast.success('Schema updated successfully');
          setProcessing(false);
        },
        onError: () => {
          toast.error('Failed to update schema');
          setProcessing(false);
        },
      },
    );
  };

  const initialBuilderSchema = useRef<FormType>(form.schema ? JSON.parse(form.schema) : INITIAL_SCHEMA);

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-4">
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Code size={16} className="me-2" />
              Form Builder
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Design Your Form</h1>
            <p className="lead text-muted">Use our drag-and-drop builder to create and customize your form</p>
          </div>

          {/* Actions Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Ready to make changes?</h6>
                  <p className="text-muted small mb-0">Return to the form editor to modify your form structure</p>
                </div>
                <div className="d-flex gap-2">
                  <Link href={route('forms.manage', form.id)} className="text-decoration-none">
                    <Button variant="outline-secondary" className="d-flex align-items-center">
                      <ArrowLeft size={16} className="me-2" />
                      Back to Manage
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    onClick={handleUpdateSchema}
                    disabled={processing || !schema}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {processing ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="me-2" />
                        Save Schema
                      </>
                    )}
                  </Button>

                  <Link href={route('forms.preview', form.id)} className="text-decoration-none">
                    <Button variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center">
                      <Eye size={18} className="me-2" />
                      Preview Form
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Form Builder */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                  style={{ width: 40, height: 40, backgroundColor: '#dcfce7' }}
                >
                  <Code size={20} className="text-success" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">Form Builder</h5>
                  <p className="text-muted small mb-0">Drag and drop components to build your form</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="px-2">
              <div style={{ minHeight: '600px' }}>
                {builderReady && <FormBuilder initialForm={initialBuilderSchema.current} onChange={(form) => setSchema(form)} />}
              </div>
            </Card.Body>
          </Card>

          {/* Tips Card */}
          <Card className="shadow-sm border-0 mt-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 fw-bold">Builder Tips</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-4">
                <Col md={4}>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#dbeafe' }}
                    >
                      <span className="fw-bold text-primary small">1</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Add Components</div>
                      <div className="text-muted small">Drag components from the left panel into your form</div>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#dcfce7' }}
                    >
                      <span className="fw-bold text-success small">2</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Configure Settings</div>
                      <div className="text-muted small">Click on components to configure their properties</div>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-start">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{ width: 32, height: 32, backgroundColor: '#ede9fe' }}
                    >
                      <span className="fw-bold text-purple small">3</span>
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Save & Preview</div>
                      <div className="text-muted small">Save your changes and preview the final form</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </AppLayout>
  );
}
