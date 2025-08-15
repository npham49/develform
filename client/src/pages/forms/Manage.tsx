import AppLayout from '@/layouts/app-layout';
import { Form } from '@/types/form';
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Eye, 
  Edit3, 
  Send, 
  Calendar, 
  Globe, 
  Lock, 
  BarChart3, 
  Settings 
} from 'lucide-react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function FormsManage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setForm(data);
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

  if (loading) {
    return <AppLayout><div>Loading...</div></AppLayout>;
  }

  if (!form) {
    return <AppLayout><div>Form not found</div></AppLayout>;
  }

  const breadcrumbs = [
    {
      name: 'Manage Forms',
      href: '/forms',
    },
    {
      name: form.name,
      href: `/forms/${form.id}/manage`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Settings size={16} className="me-2" />
              Form Management
            </Badge>
            <h1 className="display-6 fw-bold text-dark">{form.name}</h1>
            <p className="lead text-muted">
              Manage your form settings, view submissions, and track performance
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-4">
            <Link to="/forms" className="text-decoration-none">
              <Button variant="outline-secondary" className="d-flex align-items-center">
                <ArrowLeft size={16} className="me-2" />
                Back to Forms
              </Button>
            </Link>
          </div>

          <Row className="g-4">
            {/* Form Details Card */}
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                    >
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Form Details</h5>
                      <p className="text-muted small mb-0">Basic information about your form</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold text-dark">Form Name</div>
                        <div className="text-muted">{form.name}</div>
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
                    
                    <div>
                      <div className="fw-semibold text-dark">Description</div>
                      <div className="text-muted">{form.description || 'No description provided'}</div>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                      <div>
                        <div className="fw-semibold text-dark small">Created</div>
                        <div className="text-muted small d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark small">Last Updated</div>
                        <div className="text-muted small d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(form.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Quick Actions Card */}
            <Col lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Quick Actions</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <Link to={`/forms/${form.id}/schema`} className="text-decoration-none">
                      <Button variant="primary" className="w-100 d-flex align-items-center">
                        <Edit3 size={18} className="me-2" />
                        Edit Schema
                      </Button>
                    </Link>
                    <Link to={`/forms/${form.id}/preview`} className="text-decoration-none">
                      <Button variant="outline-primary" className="w-100 d-flex align-items-center">
                        <Eye size={18} className="me-2" />
                        Preview Form
                      </Button>
                    </Link>
                    <Link to={`/forms/${form.id}/submit`} className="text-decoration-none">
                      <Button variant="outline-success" className="w-100 d-flex align-items-center">
                        <Send size={18} className="me-2" />
                        Submit Form
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats and Analytics Row */}
          <Row className="g-4 mt-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Form Analytics</h5>
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                      <BarChart3 size={16} className="me-1" />
                      View Details
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#dbeafe' }}
                        >
                          <Send size={20} className="text-primary" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">Total Submissions</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#dcfce7' }}
                        >
                          <Eye size={20} className="text-success" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">Total Views</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#ede9fe' }}
                        >
                          <BarChart3 size={20} className="text-purple" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0%
                        </div>
                        <div className="text-muted small">Conversion Rate</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#ffedd5' }}
                        >
                          <Calendar size={20} className="text-warning" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">This Week</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Row className="g-4 mt-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Recent Activity</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="text-center py-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{ width: 64, height: 64, backgroundColor: '#f8f9fa' }}
                    >
                      <BarChart3 size={24} className="text-muted" />
                    </div>
                    <h6 className="text-muted">No Recent Activity</h6>
                    <p className="text-muted small mb-0">
                      Activity and submissions will appear here once your form starts receiving responses
                    </p>
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