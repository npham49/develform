import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/loading-spinner';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import type { FormWithCreator } from '@/types/api';
import { FormBuilder, type FormType } from '@formio/react';
import { ArrowLeft, Code, Eye, Save } from 'lucide-react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export const INITIAL_SCHEMA = { title: '', name: '', path: '', display: 'form' as const, type: 'form' as const, components: [] };

export const Route = createFileRoute('/forms/$formId/schema')({
  loader: async ({ params }) => {
    try {
      const response = await api.forms.get(parseInt(params.formId));
      return { form: response.data };
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },
  staleTime: 0, // Always refetch
  gcTime: 0, // Don't cache
  component: FormsSchema,
});

function FormsSchema() {
  const { form } = useLoaderData({ from: '/forms/$formId/schema' }) as { form: FormWithCreator };
  const [schema, setSchema] = useState<FormType | null>(form?.schema || INITIAL_SCHEMA);
  const [processing, setProcessing] = useState(false);

  const initialBuilderSchema = useRef<FormType>(form?.schema || INITIAL_SCHEMA);

  const handleUpdateSchema = async () => {
    if (!form || !schema) return;
    setProcessing(true);

    try {
      await api.forms.updateSchema(form.id, { schema });
      toast.success('Schema updated successfully');
    } catch (error: unknown) {
      console.error('Error updating schema:', error);
      toast.error((error as Error).message || 'Failed to update schema');
    } finally {
      setProcessing(false);
    }
  };

  if (!form) {
    return (
      <AppLayout>
        <LoadingSpinner text="Form not found" />
      </AppLayout>
    );
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: '/forms',
    },
    {
      title: form.name,
      href: `/forms/${form.id}/manage`,
    },
    {
      title: 'Schema',
      href: `/forms/${form.id}/schema`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-4">
          <PageHeader
            badge={{ icon: Code, text: 'Form Builder' }}
            title="Design Your Form"
            description="Use our drag-and-drop builder to create and customize your form"
          />

          {/* Actions Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Ready to make changes?</h6>
                  <p className="text-muted small mb-0">Return to the form editor to modify your form structure</p>
                </div>
                <div className="d-flex gap-2">
                  <Link to="/forms/$formId/manage" params={{ formId: form.id.toString() }} className="text-decoration-none">
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

                  <Link to="/forms/$formId/preview" params={{ formId: form.id.toString() }} className="text-decoration-none">
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
                <FormBuilder initialForm={initialBuilderSchema.current} onChange={(form) => setSchema(form)} />
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
