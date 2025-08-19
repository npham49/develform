import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, FileText, Info, Plus } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Form',
    href: '/forms/create',
  },
];

export default function FormsCreate() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    description: '',
    is_public: false,
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create form');
      }

      // const result = await response.json();
      toast.success('Form created successfully');
      navigate({ to: '/forms' });
    } catch (error: any) {
      console.error('Error creating form:', error);
      setErrors({ general: error.message || 'Failed to create form' });
      toast.error('Failed to create form');
    } finally {
      setProcessing(false);
    }
  };

  const setFieldData = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Plus size={16} className="me-2" />
              Create New Form
            </Badge>
            <h1 className="display-5 fw-bold text-dark">Create Your Form</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Start building your form with our intuitive form builder. Add fields, customize styling, and configure validation.
            </p>
          </div>

          {/* Main Form */}
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-4">
                  <div className="d-flex align-items-center">
                    <Link to="/forms" className="text-decoration-none me-3">
                      <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                        <ArrowLeft size={16} className="me-1" />
                        Back to Forms
                      </Button>
                    </Link>
                    <div>
                      <h5 className="mb-0 fw-bold">Form Details</h5>
                      <p className="text-muted small mb-0">Provide basic information about your form</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Form Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setFieldData('name', e.target.value)}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter a descriptive name for your form"
                        required
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        name="description"
                        value={data.description}
                        onChange={(e) => setFieldData('description', e.target.value)}
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        rows={4}
                        placeholder="Provide a brief description of what this form is for (optional)"
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="mb-4">
                      <Card className="border-0" style={{ backgroundColor: '#f8f9fa' }}>
                        <Card.Body className="p-3">
                          <div className="d-flex align-items-start">
                            <div className="me-3">
                              <Info size={20} className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-semibold mb-2">Visibility Settings</h6>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  name="is_public"
                                  checked={data.is_public}
                                  onChange={(e) => setFieldData('is_public', e.target.checked)}
                                  className="form-check-input"
                                  id="is_public"
                                />
                                <label className="form-check-label" htmlFor="is_public">
                                  <strong>Make this form public</strong>
                                </label>
                              </div>
                              <p className="text-muted small mb-0 mt-1">
                                {data.is_public
                                  ? 'This form will be accessible to anyone with the link'
                                  : 'This form will only be accessible to authenticated users'}
                              </p>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                      {errors.is_public && <div className="text-danger small mt-1">{errors.is_public}</div>}
                    </div>

                    <div className="d-flex gap-3">
                      <Button type="submit" disabled={processing} variant="primary" className="d-flex align-items-center px-4">
                        {processing ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <FileText size={18} className="me-2" />
                            Create Form
                          </>
                        )}
                      </Button>
                      <Link to="/forms" className="text-decoration-none">
                        <Button variant="outline-secondary" disabled={processing}>
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Next Steps Card */}
          <Row className="justify-content-center mt-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h6 className="mb-0 fw-bold">What's Next?</h6>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 32, height: 32, backgroundColor: '#dbeafe' }}
                        >
                          <span className="fw-bold text-primary small">1</span>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Design Your Form</div>
                        <div className="text-muted small">Use the form builder to add fields and customize the layout</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 32, height: 32, backgroundColor: '#dcfce7' }}
                        >
                          <span className="fw-bold text-success small">2</span>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Test & Preview</div>
                        <div className="text-muted small">Preview your form and test all functionality before publishing</div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 32, height: 32, backgroundColor: '#ede9fe' }}
                        >
                          <span className="fw-bold text-purple small">3</span>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark">Share & Collect</div>
                        <div className="text-muted small">Share your form link and start collecting submissions</div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  );
}
