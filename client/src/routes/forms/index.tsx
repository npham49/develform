import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Calendar, Eye, FileText, Globe, Lock, MoreVertical, Plus, Settings } from 'lucide-react';
import { Badge, Button, Card, Col, Container, Dropdown, Row, Table } from 'react-bootstrap';
import { Link } from '@tanstack/react-router';

interface Form {
  id: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

function FormsIndex() {
  const { forms } = useLoaderData({ from: '/forms/' }) as { forms: Form[] };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: '/forms',
    },
  ];

  // Sort forms by updated_at and get the 4 most recent
  const recentForms = [...forms].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
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
            <Link to="/forms/create" className="text-decoration-none">
              <Button variant="primary" className="d-flex align-items-center">
                <Plus size={18} className="me-2" />
                Create New Form
              </Button>
            </Link>
          </div>

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
                  <Link to="/forms/create" className="text-decoration-none">
                    <Button variant="primary" size="lg" className="d-flex align-items-center mx-auto">
                      <Plus size={20} className="me-2" />
                      Create Your First Form
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <>
              {/* Recent Forms Section */}
              {recentForms.length > 0 && (
                <div className="mb-5">
                  <h5 className="fw-bold text-dark mb-3">Recently Updated</h5>
                  <Row className="g-4">
                    {recentForms.map((form) => (
                      <Col md={6} lg={3} key={form.id}>
                        <Card className="h-100 shadow-sm border-0 hover-shadow">
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-start justify-content-between mb-3">
                              <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                              >
                                <FileText size={16} className="text-primary" />
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                {form.isPublic ? (
                                  <Badge bg="success" className="d-flex align-items-center small">
                                    <Globe size={10} className="me-1" />
                                    Public
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary" className="d-flex align-items-center small">
                                    <Lock size={10} className="me-1" />
                                    Private
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>
                              {form.name}
                            </h6>
                            <p className="text-muted small mb-2" style={{ height: '2.5rem', overflow: 'hidden' }}>
                              {form.description || 'No description'}
                            </p>

                            <div className="d-flex align-items-center text-muted small mb-3">
                              <Calendar size={12} className="me-1" />
                              Updated {new Date(form.updatedAt).toLocaleDateString()}
                            </div>

                            <div className="d-flex gap-2">
                              <Link to="/forms/$id/manage" params={{ id: form.id.toString() }} className="flex-fill text-decoration-none">
                                <Button variant="outline-primary" size="sm" className="w-100 d-flex align-items-center justify-content-center">
                                  <Settings size={14} className="me-1" />
                                  Manage
                                </Button>
                              </Link>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* All Forms Table */}
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">All Forms</h5>
                    <Badge bg="light" text="dark">
                      {forms.length} total
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4 py-3">Form</th>
                        <th className="py-3">Status</th>
                        <th className="py-3">Created</th>
                        <th className="py-3">Updated</th>
                        <th className="py-3 text-end pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forms.map((form, index) => (
                        <tr key={form.id} className={index % 2 === 0 ? 'table-light' : ''}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                                style={{ width: 32, height: 32, backgroundColor: '#dbeafe' }}
                              >
                                <FileText size={14} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{form.name}</div>
                                <div
                                  className="text-muted small"
                                  style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                  {form.description || 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            {form.isPublic ? (
                              <Badge bg="success" className="d-flex align-items-center w-fit">
                                <Globe size={12} className="me-1" />
                                Public
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="d-flex align-items-center w-fit">
                                <Lock size={12} className="me-1" />
                                Private
                              </Badge>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="text-muted small">{new Date(form.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3">
                            <div className="text-muted small">{new Date(form.updatedAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 text-end pe-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <Link to="/forms/$id/manage" params={{ id: form.id.toString() }} className="text-decoration-none">
                                <Button variant="primary" size="sm" className="d-flex align-items-center">
                                  <Settings size={14} className="me-2" />
                                  Manage
                                </Button>
                              </Link>
                              <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0 d-flex align-items-center">
                                  <MoreVertical size={14} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="z-1000">
                                  <Dropdown.Item>
                                    <Link to="/forms/$id/preview" params={{ id: form.id.toString() }} className="text-decoration-none d-flex align-items-center">
                                      <Eye size={14} className="me-1" />
                                      Preview
                                    </Link>
                                  </Dropdown.Item>
                                  <Dropdown.Item>
                                    <Link to="/forms/$formId/submit" params={{ formId: form.id.toString() }} className="text-decoration-none d-flex align-items-center">
                                      <FileText size={14} className="me-2" />
                                      Submit
                                    </Link>
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item className="text-danger">Delete Form</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
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
                        {forms.filter((f) => f.isPublic).length}
                      </div>
                      <div className="text-muted small">Public Forms</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.filter((f) => !f.isPublic).length}
                      </div>
                      <div className="text-muted small">Private Forms</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                        {forms.filter((f) => new Date(f.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
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

export const Route = createFileRoute('/forms/')({
  loader: async () => {
    try {
      const response = await fetch('/api/forms', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        return { forms: data.data || data };
      } else {
        throw new Error('Failed to fetch forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      return { forms: [] };
    }
  },
  component: FormsIndex,
});
