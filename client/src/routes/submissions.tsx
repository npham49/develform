import { createFileRoute, Link, redirect, useLoaderData } from '@tanstack/react-router';

import { PageHeader } from '@/components/common/page-header';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { type BreadcrumbItem } from '@/types';
import type { FormSummary, SubmissionSummary } from '@/types/api';
import { Calendar, FileText, Users } from 'lucide-react';
import { Badge, Button, Card, Col, Container, Row, Table } from 'react-bootstrap';

interface FormSubmissions {
  form: FormSummary;
  submissions: SubmissionSummary[];
}

export const Route = createFileRoute('/submissions')({
  beforeLoad: async () => {
    // Check if user is authenticated by calling the auth API
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw redirect({
          to: '/auth/login',
          search: {
            redirect: window.location.pathname,
          },
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('redirect')) {
        throw error; // Re-throw redirect
      }
      throw redirect({
        to: '/auth/login',
        search: {
          redirect: window.location.pathname,
        },
      });
    }
  },
  loader: async () => {
    try {
      // Get all forms first
      const formsResponse = await api.forms.list();
      const forms = formsResponse.data;

      // Get submissions for each form
      const formSubmissions: FormSubmissions[] = [];
      
      for (const form of forms) {
        try {
          const submissionsResponse = await api.submissions.getByForm(form.id);
          formSubmissions.push({
            form,
            submissions: submissionsResponse.data,
          });
        } catch (error) {
          // If we can't get submissions for a form, just skip it
          console.warn(`Failed to get submissions for form ${form.id}:`, error);
          formSubmissions.push({
            form,
            submissions: [],
          });
        }
      }

      return { formSubmissions };
    } catch (error) {
      console.error('Error fetching submissions data:', error);
      throw error;
    }
  },
  staleTime: 0, // Always refetch
  gcTime: 0, // Don't cache
  component: Submissions,
});

function Submissions() {
  const { formSubmissions } = useLoaderData({ from: '/submissions' }) as {
    formSubmissions: FormSubmissions[];
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'All Submissions',
      href: '/submissions',
    },
  ];

  // Calculate totals
  const totalSubmissions = formSubmissions.reduce((total, fs) => total + fs.submissions.length, 0);
  const totalForms = formSubmissions.length;
  const recentSubmissions = formSubmissions
    .flatMap((fs) => 
      fs.submissions.map((submission) => ({
        ...submission,
        formName: fs.form.name,
        formId: fs.form.id,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <PageHeader
            badge={{ icon: FileText, text: 'Submissions Management' }}
            title="All Submissions"
            description="View and manage submissions across all your forms from one central location."
          />

          {/* Summary Stats */}
          <Row className="g-4 mb-5">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, backgroundColor: '#dbeafe' }}
                  >
                    <FileText size={28} className="text-primary" />
                  </div>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '2rem' }}>
                    {totalSubmissions}
                  </div>
                  <div className="text-muted">Total Submissions</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, backgroundColor: '#dcfce7' }}
                  >
                    <Users size={28} className="text-success" />
                  </div>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '2rem' }}>
                    {totalForms}
                  </div>
                  <div className="text-muted">Active Forms</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, backgroundColor: '#ede9fe' }}
                  >
                    <Calendar size={28} className="text-purple" />
                  </div>
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '2rem' }}>
                    {recentSubmissions.filter(s => 
                      new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ).length}
                  </div>
                  <div className="text-muted">This Week</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Forms with Submissions */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Forms and Submissions</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {formSubmissions.length > 0 ? (
                    <Table responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 py-3 px-4">Form</th>
                          <th className="border-0 py-3 px-4">Submissions</th>
                          <th className="border-0 py-3 px-4">Last Updated</th>
                          <th className="border-0 py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formSubmissions.map((formSub) => (
                          <tr key={formSub.form.id}>
                            <td className="py-3 px-4">
                              <div>
                                <div className="fw-semibold text-dark">{formSub.form.name}</div>
                                <div className="text-muted small">{formSub.form.description || 'No description'}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge bg={formSub.submissions.length > 0 ? 'primary' : 'secondary'}>
                                {formSub.submissions.length}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <small className="text-muted">
                                {new Date(formSub.form.updatedAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td className="py-3 px-4">
                              <div className="d-flex gap-2">
                                <Link 
                                  to="/forms/$formId/submissions" 
                                  params={{ formId: formSub.form.id.toString() }}
                                  className="text-decoration-none"
                                >
                                  <Button variant="outline-primary" size="sm">
                                    View Submissions
                                  </Button>
                                </Link>
                                <Link 
                                  to="/forms/$formId/manage" 
                                  params={{ formId: formSub.form.id.toString() }}
                                  className="text-decoration-none"
                                >
                                  <Button variant="outline-secondary" size="sm">
                                    Manage
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-5">
                      <FileText size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No Forms Found</h5>
                      <p className="text-muted mb-4">Create your first form to start collecting submissions.</p>
                      <Link to="/forms/create" className="text-decoration-none">
                        <Button variant="primary">Create Form</Button>
                      </Link>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Submissions */}
            <Col lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Recent Submissions</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {recentSubmissions.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {recentSubmissions.map((submission) => (
                        <div key={submission.id} className="d-flex align-items-center justify-content-between">
                          <div className="flex-grow-1">
                            <div className="fw-semibold text-dark small">{submission.formName}</div>
                            <div className="text-muted small d-flex align-items-center">
                              <Calendar size={12} className="me-1" />
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </div>
                            {submission.submitterInformation && (
                              <div className="text-muted small">
                                {submission.submitterInformation.name}
                              </div>
                            )}
                          </div>
                          <Link 
                            to="/submissions/$submissionId" 
                            params={{ submissionId: submission.id.toString() }}
                            className="text-decoration-none"
                          >
                            <Button variant="outline-primary" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText size={32} className="text-muted mb-2" />
                      <div className="text-muted small">No submissions yet</div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  );
}