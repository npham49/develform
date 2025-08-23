import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';

import { IconCard } from '@/components/icon-card';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import type { FormWithCreator } from '@/types/api';
import { ArrowLeft, BarChart3, Calendar, Edit3, Eye, FileText, Send, Settings } from 'lucide-react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

export const Route = createFileRoute('/forms/$formId/manage')({
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
  component: FormsManage,
});

function FormsManage() {
  const { form } = useLoaderData({ from: '/forms/$formId/manage' }) as { form: FormWithCreator };

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
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <PageHeader
            badge={{ icon: Settings, text: 'Form Management' }}
            title={form.name}
            description="Manage your form settings, view submissions, and track performance"
          />

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
                  <IconCard
                    icon={FileText}
                    iconColor="text-primary"
                    iconBg="#dbeafe"
                    title="Form Details"
                    description="Basic information about your form"
                  />
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold text-dark">Form Name</div>
                        <div className="text-muted">{form.name}</div>
                      </div>
                      <StatusBadge isPublic={form.isPublic} />
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
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark small">Last Updated</div>
                        <div className="text-muted small d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(form.updatedAt).toLocaleDateString()}
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
                    <Link to="/forms/$formId/schema" params={{ formId: form.id.toString() }} className="text-decoration-none">
                      <Button variant="primary" className="w-100 d-flex align-items-center">
                        <Edit3 size={18} className="me-2" />
                        Edit Schema
                      </Button>
                    </Link>
                    <Link to="/forms/$formId/preview" params={{ formId: form.id.toString() }} className="text-decoration-none">
                      <Button variant="outline-primary" className="w-100 d-flex align-items-center">
                        <Eye size={18} className="me-2" />
                        Preview Form
                      </Button>
                    </Link>
                    <Link to="/forms/$formId/submit" params={{ formId: form.id.toString() }} className="text-decoration-none">
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
                    <p className="text-muted small mb-0">Activity and submissions will appear here once your form starts receiving responses</p>
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
