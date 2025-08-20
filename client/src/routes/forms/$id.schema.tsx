import { createFileRoute } from '@tanstack/react-router';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { FormBuilder, type FormType } from '@formio/react';
import { ArrowLeft, Code, Eye, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';

export const INITIAL_SCHEMA = { title: '', name: '', path: '', display: 'form' as const, type: 'form' as const, components: [] };

function FormsSchema() {
  const [builderReady, setBuilderReady] = useState(false);
  const { id } = useParams({ from: '/forms/$id/schema' });
  const [form, setForm] = useState<Form | null>(null);
  const [schema, setSchema] = useState<FormType | null>(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const initialBuilderSchema = useRef<FormType>(INITIAL_SCHEMA);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const formData = data.data || data;
          setForm(formData);
          setSchema(formData.schema || '{}');
          initialBuilderSchema.current = formData.schema ? formData.schema : INITIAL_SCHEMA;
          setBuilderReady(true);
        } else {
          throw new Error('Failed to fetch form');
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id]);

  const handleUpdateSchema = async () => {
    if (!form || !schema) return;
    setProcessing(true);

    try {
      const response = await fetch(`/api/forms/${form.id}/schema`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ schema }),
      });

      if (response.ok) {
        toast.success('Schema updated successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update schema');
      }
    } catch (error: unknown) {
      console.error('Error updating schema:', error);
      toast.error((error as Error).message || 'Failed to update schema');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );
  }

  if (!form) {
    return (
      <AppLayout>
        <div>Form not found</div>
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
                  <Link to="/forms/$id/manage" params={{ id: form.id.toString() }} className="text-decoration-none">
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

                  <Link to="/forms/$id/preview" params={{ id: form.id.toString() }} className="text-decoration-none">
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

export const Route = createFileRoute('/forms/$id/schema')({
  loader: async ({ params }) => {
    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return { form: data.data || data };
      } else {
        throw new Error('Failed to fetch form');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      throw error;
    }
  },
  component: FormsSchema,
});
