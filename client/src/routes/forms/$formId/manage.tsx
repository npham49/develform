import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router';
import { useState } from 'react';

import { IconCard } from '@/components/common/icon-card';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { CreateVersionButton } from '@/components/versions/create-version-button';
import { EnhancedVersionHistoryTree } from '@/components/versions/enhanced-version-history-tree';
import { VersionAnalyticsDashboard } from '@/components/versions/version-analytics-dashboard';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { requireAuth } from '@/lib/auth-utils';
import { type BreadcrumbItem } from '@/types';
import type { FormVersion, FormWithCreator } from '@/types/api';
import { ArrowLeft, BarChart3, Calendar, Code, Copy, Edit3, Eye, FileText, Send, Settings, Users } from 'lucide-react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

// Component for displaying embed code examples
function EmbedCodeSection({ formId, formName }: { formId: number; formName: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  const baseUrl = window.location.origin;

  const embedCodes = {
    html: `<!-- Embed ${formName} Form -->
<iframe 
  src="${baseUrl}/forms/${formId}/submit?embed=true"
  width="100%" 
  height="600"
  frameborder="0"
  scrolling="auto"
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>`,
    
    react: `// React Component for ${formName}
function EmbeddedForm() {
  return (
    <iframe
      src="${baseUrl}/forms/${formId}/submit?embed=true"
      width="100%"
      height="600"
      frameBorder="0"
      scrolling="auto"
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}
      title="${formName} Form"
    />
  );
}`,

    wordpress: `<!-- WordPress Shortcode for ${formName} -->
[iframe src="${baseUrl}/forms/${formId}/submit?embed=true" width="100%" height="600" scrolling="auto"]

<!-- Or use HTML block in Gutenberg editor -->
<iframe 
  src="${baseUrl}/forms/${formId}/submit?embed=true"
  width="100%" 
  height="600"
  frameborder="0"
  scrolling="auto"
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>`
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="bg-white py-3">
        <div className="d-flex align-items-center">
          <Code size={20} className="text-primary me-2" />
          <div>
            <h5 className="mb-0 fw-bold">Embed Form</h5>
            <small className="text-muted">Copy and paste these code snippets to embed your public form</small>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <Row className="g-4">
          {/* HTML */}
          <Col lg={4}>
            <div className="border rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold mb-0">HTML</h6>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => copyToClipboard(embedCodes.html, 'html')}
                  className="d-flex align-items-center"
                >
                  <Copy size={14} className="me-1" />
                  {copied === 'html' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-light p-2 rounded small" style={{ fontSize: '0.75rem', maxHeight: '200px', overflow: 'auto' }}>
                <code>{embedCodes.html}</code>
              </pre>
            </div>
          </Col>

          {/* React */}
          <Col lg={4}>
            <div className="border rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold mb-0">React</h6>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => copyToClipboard(embedCodes.react, 'react')}
                  className="d-flex align-items-center"
                >
                  <Copy size={14} className="me-1" />
                  {copied === 'react' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-light p-2 rounded small" style={{ fontSize: '0.75rem', maxHeight: '200px', overflow: 'auto' }}>
                <code>{embedCodes.react}</code>
              </pre>
            </div>
          </Col>

          {/* WordPress */}
          <Col lg={4}>
            <div className="border rounded p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold mb-0">WordPress</h6>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => copyToClipboard(embedCodes.wordpress, 'wordpress')}
                  className="d-flex align-items-center"
                >
                  <Copy size={14} className="me-1" />
                  {copied === 'wordpress' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-light p-2 rounded small" style={{ fontSize: '0.75rem', maxHeight: '200px', overflow: 'auto' }}>
                <code>{embedCodes.wordpress}</code>
              </pre>
            </div>
          </Col>
        </Row>

        {/* Usage Notes */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="fw-bold mb-2">📝 Usage Notes</h6>
          <ul className="mb-0 small text-muted">
            <li>Forms are embedded with <code>?embed=true</code> parameter for minimal styling</li>
            <li>Recommended iframe height is 600px, but adjust based on your form length</li>
            <li>Forms are responsive and will adapt to iframe width</li>
            <li>Only public forms can be embedded - private forms will show an error message</li>
            <li>Success pages will also be embedded when users submit the form</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}

export const Route = createFileRoute('/forms/$formId/manage')({
  beforeLoad: ({ context }) => {
    requireAuth(context, window.location.pathname);
  },
  loader: async ({ params }) => {
    try {
      const formId = parseInt(params.formId);
      const [formResponse, versionsResponse] = await Promise.all([api.forms.get(formId), api.versions.list(formId)]);
      return {
        form: formResponse.data,
        versions: versionsResponse.data.versions,
        liveVersionSha: versionsResponse.data.liveVersion,
      };
    } catch (error) {
      console.error('Error fetching form data:', error);
      throw error;
    }
  },
  staleTime: 0, // Always refetch
  gcTime: 0, // Don't cache
  component: FormsManage,
});

function FormsManage() {
  const { form, versions, liveVersionSha } = useLoaderData({ from: '/forms/$formId/manage' }) as {
    form: FormWithCreator;
    versions: FormVersion[];
    liveVersionSha: string | null;
  };

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
                    <div className="d-flex flex-column gap-2">
                      {(() => {
                        // Find the latest version by creation date
                        const latestVersion = versions.reduce((latest, current) =>
                          new Date(current.createdAt).getTime() > new Date(latest.createdAt).getTime() ? current : latest,
                        );
                        const isLatestDraft = latestVersion && !latestVersion.isPublished;

                        if (isLatestDraft) {
                          // Latest version is a draft - show edit and create new version options
                          return (
                            <>
                              <Link
                                to="/forms/$formId/versions/$versionId/edit"
                                params={{
                                  formId: form.id.toString(),
                                  versionId: latestVersion.versionSha,
                                }}
                                className="text-decoration-none"
                              >
                                <Button variant="primary" className="w-100 d-flex align-items-center">
                                  <Edit3 size={18} className="me-2" />
                                  Edit Latest Draft
                                </Button>
                              </Link>
                              <CreateVersionButton formId={form.id} baseVersion={latestVersion} variant="outline-secondary" size="lg">
                                Create New Version
                              </CreateVersionButton>
                            </>
                          );
                        } else if (latestVersion) {
                          // Latest version is published - only show create new version
                          return (
                            <CreateVersionButton formId={form.id} baseVersion={latestVersion} variant="primary" size="lg">
                              Create New Version
                            </CreateVersionButton>
                          );
                        } else {
                          // No versions exist - show create initial version
                          return <CreateVersionButton formId={form.id} />;
                        }
                      })()}
                    </div>

                    <Link to="/forms/$formId/submit" params={{ formId: form.id.toString() }} className="text-decoration-none">
                      <Button variant="outline-success" className="w-100 d-flex align-items-center">
                        <Send size={18} className="me-2" />
                        Submit Form
                      </Button>
                    </Link>
                    
                    <Link to="/forms/$formId/submissions" params={{ formId: form.id.toString() }} className="text-decoration-none">
                      <Button variant="outline-info" className="w-100 d-flex align-items-center">
                        <Users size={18} className="me-2" />
                        View Submissions
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

          {/* Version Analytics Dashboard */}
          <Row className="g-4 mt-4">
            <Col>
              <VersionAnalyticsDashboard
                versions={versions}
                submissionStats={{
                  totalSubmissions: 0, // TODO: Fetch from API
                  versionBreakdown: [], // TODO: Fetch from API
                }}
              />
            </Col>
          </Row>

          {/* Embed Code Section - Only for Public Forms */}
          {form.isPublic && (
            <Row className="g-4 mt-4">
              <Col>
                <EmbedCodeSection formId={form.id} formName={form.name} />
              </Col>
            </Row>
          )}

          {/* Enhanced Version History */}
          <Row className="g-4 mt-4">
            <Col>
              <EnhancedVersionHistoryTree formId={form.id} versions={versions} liveVersionSha={liveVersionSha} showActions={true} />
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  );
}
