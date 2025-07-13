import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Plus, Eye, Settings, Calendar, Globe, Lock } from 'lucide-react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <FileText size={16} className="me-2" />
              Form Management
            </Badge>
            <h1 className="display-5 fw-bold text-dark">Your Forms</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Create, edit, and manage all your forms from one central location. Track submissions and monitor performance.
            </p>
          </div>

          {/* Action Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 fw-semibold text-dark">All Forms ({forms.length})</h4>
            </div>
            <Link href={route('forms.create')} className="text-decoration-none">
              <Button variant="primary" className="d-flex align-items-center">
                <Plus size={18} className="me-2" />
                Create New Form
              </Button>
            </Link>
          </div>

          {/* Forms Grid */}
          {forms.length === 0 ? (
            <Card className="shadow-sm border-0 text-center py-5">
              <Card.Body>
                <div className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{ width: 80, height: 80, backgroundColor: '#f8f9fa' }}
                  >
                    <FileText size={32} className="text-muted" />
                  </div>
                  <h3 className="fw-bold text-dark mb-3">No Forms Yet</h3>
                  <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    Create your first form to get started with collecting submissions and managing your data.
                  </p>
                  <Link href={route('forms.create')} className="text-decoration-none">
                    <Button variant="primary" size="lg" className="d-flex align-items-center mx-auto">
                      <Plus size={20} className="me-2" />
                      Create Your First Form
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {forms.map((form) => (
                <Col md={6} lg={4} key={form.id}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start justify-content-between mb-3">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 48, height: 48, backgroundColor: '#dbeafe' }}
                        >
                          <FileText size={20} className="text-primary" />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {form.is_public ? (
                            <Badge bg="success" className="d-flex align-items-center">
                              <Globe size={12} className="me-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="d-flex align-items-center">
                              <Lock size={12} className="me-1" />
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <h5 className="fw-bold text-dark mb-2">{form.name}</h5>
                      <p className="text-muted mb-3" style={{ height: '3rem', overflow: 'hidden' }}>
                        {form.description || 'No description provided'}
                      </p>
                      
                      <div className="d-flex align-items-center text-muted small mb-3">
                        <Calendar size={14} className="me-1" />
                        Created {new Date(form.created_at).toLocaleDateString()}
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Link href={route('forms.manage', form.id)} className="flex-fill text-decoration-none">
                          <Button variant="outline-primary" size="sm" className="w-100 d-flex align-items-center justify-content-center">
                            <Settings size={16} className="me-1" />
                            Manage
                          </Button>
                        </Link>
                        <Link href={route('forms.preview', form.id)} className="text-decoration-none">
                          <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                            <Eye size={16} />
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {/* Stats Section */}
          {forms.length > 0 && (
            <Card className="shadow-sm border-0 mt-5">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Quick Stats</h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.length}
                      </div>
                      <div className="text-muted small">Total Forms</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.filter(f => f.is_public).length}
                      </div>
                      <div className="text-muted small">Public Forms</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.filter(f => !f.is_public).length}
                      </div>
                      <div className="text-muted small">Private Forms</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.filter(f => new Date(f.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                      </div>
                      <div className="text-muted small">Created This Week</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </AppLayout>
  );
}
