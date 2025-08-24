import { PageHeader } from '@/components/common/page-header';
import { VersionShaDisplay } from '@/components/common/version-sha-display';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import { Webform } from '@formio/js';
import { Form, Submission } from '@formio/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Eye, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { Alert, Card, Container } from 'react-bootstrap';
import { toast } from 'sonner';

export const Route = createFileRoute('/forms/$formId/versions/$versionId/preview')({
  loader: async ({ params }) => {
    const formId = parseInt(params.formId);
    const versionId = params.versionId;

    if (isNaN(formId)) {
      throw new Error('Invalid form ID');
    }

    // Get form basic info
    const formResponse = await api.forms.get(formId);

    // Get specific version with schema
    const versionResponse = await api.versions.get(formId, versionId);

    return {
      form: formResponse.data,
      version: versionResponse.data,
    };
  },
  component: VersionPreviewPage,
});

function VersionPreviewPage() {
  const { form, version } = Route.useLoaderData();
  const { formId } = Route.useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const previewRef = useRef<Webform>(null);

  const handleSubmit = (submission: Submission) => {
    if (previewRef.current) {
      previewRef.current.emit('submitDone', submission);
      setSubmissionData(submission.data as unknown as null);
      toast.success('PREVIEW: Form submitted successfully');
    }
  };

  const handleFormReady = (formInstance: Webform) => {
    previewRef.current = formInstance;
  };

  return (
    <AppLayout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)' }}>
        <Container className="py-4">
          {/* Header */}
          <div className="mb-4">
            <Link to="/forms/$formId/manage" params={{ formId }} className="btn btn-outline-secondary btn-sm mb-3">
              <ArrowLeft size={16} className="me-2" />
              Back to Form Management
            </Link>

            <PageHeader
              badge={{ icon: Eye, text: 'Version Preview' }}
              title={`${form.name} - Version Preview`}
              description={`Preview of version ${version.versionSha.slice(0, 8)} (${version.description || 'No description'})`}
            />
          </div>

          {/* Version Info Alert */}
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <Info size={20} className="me-2" />
              <div>
                <strong>Version Information:</strong>
                <div className="small mt-1">
                  <strong>SHA:</strong> <code>{version.versionSha}</code> •<strong className="ms-2">Status:</strong>{' '}
                  {version.isPublished ? 'Published' : 'Draft'} •<strong className="ms-2">Created:</strong>{' '}
                  {new Date(version.createdAt).toLocaleString()}
                  {version.author && (
                    <>
                      <strong className="ms-2">Author:</strong> {version.author.name}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Alert>

          <div className="row">
            {/* Form Preview */}
            <div className="col-lg-8">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-semibold">Form Preview</h5>
                  <small className="text-muted">This is how the form looked in this version</small>
                </Card.Header>
                <Card.Body className="p-4">
                  {version.schema ? (
                    <Form
                      src={version.schema}
                      onSubmit={handleSubmit}
                      onFormReady={handleFormReady}
                      options={{
                        readOnly: false,
                        noAlerts: true,
                        buttonSettings: {
                          showCancel: false,
                          showPrevious: false,
                          showNext: false,
                          showSubmit: true,
                        },
                      }}
                    />
                  ) : (
                    <Alert variant="warning">
                      <strong>No Schema Available</strong>
                      <div>This version doesn't have a valid schema to preview.</div>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* Submission Data (if any) */}
            <div className="col-lg-4">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h6 className="mb-0 fw-semibold">Preview Submission Data</h6>
                  <small className="text-muted">Data from form interactions</small>
                </Card.Header>
                <Card.Body className="p-4">
                  {submissionData ? (
                    <div>
                      <Alert variant="success" className="mb-3">
                        <strong>Form Submitted!</strong> This is preview data only.
                      </Alert>
                      <div className="bg-light p-3 rounded">
                        <pre className="mb-0 small">
                          <code>{JSON.stringify(submissionData, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <Eye size={48} className="opacity-50 mb-3" />
                      <p className="mb-0">Fill out the form to see submission data here</p>
                      <small>This is preview mode - no data will be saved</small>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>

          {/* Version SHA Display */}
          <div className="mt-4">
            <VersionShaDisplay versionSha={version.versionSha} />
          </div>
        </Container>
      </div>
    </AppLayout>
  );
}
