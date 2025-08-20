import { createFileRoute } from '@tanstack/react-router';
import { useParams, useSearch } from '@tanstack/react-router';
import AppLayout from '@/layouts/app-layout';
import { Form as FormioForm } from '@formio/react';
import { CheckCircle, Copy, Download, Shield, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Container } from 'react-bootstrap';
import { api } from '@/lib/api';

interface SubmitSuccessProps {
  submission_id?: number;
  form_name?: string;
  submission_data?: Record<string, unknown>;
  schema?: string;
  created_at?: string;
  token?: string;
  submitter_information?: {
    name: string;
    email: string;
  };
  is_form_owner?: boolean;
}

function FormsSuccess({
  submission_id,
  schema,
  token,
}: SubmitSuccessProps) {
  const { formId, submissionId } = useParams({ from: '/forms/$formId/submit/success/$submissionId' });
  const searchParams = useSearch({ from: '/forms/$formId/submit/success/$submissionId' });
  const [submissionDetails, setSubmissionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formSchema = useRef(schema ? JSON.parse(schema) : {});
  const [formReady, setFormReady] = useState(false);
  const [copied, setCopied] = useState(false);

  const actualSubmissionId = submission_id || (submissionId ? parseInt(submissionId) : null);
  const actualToken = token || (searchParams as any)?.token;

  useEffect(() => {
    const fetchSubmissionData = async () => {
      if (!actualSubmissionId) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching submission data for:', actualSubmissionId);
        // Fetch submission data from API
        const response = await api.submissions.get(actualSubmissionId, actualToken || undefined);
        const submissionData = response.data;
        
        setSubmissionDetails({
          submission_id: submissionData.id,
          form_name: submissionData.formName,
          submission_data: submissionData.data,
          schema: submissionData.schema,
          created_at: submissionData.createdAt,
          token: submissionData.token,
          submitter_information: submissionData.submitterInformation,
          is_form_owner: submissionData.isFormOwner
        });
        
        if (submissionData.schema) {
          formSchema.current = submissionData.schema;
        }
      } catch (error) {
        console.error('Error fetching submission data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load submission');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, [actualSubmissionId, actualToken]);

  const submissionUrl = actualToken
    ? `${window.location.origin}/forms/${formId}/submit/success/${actualSubmissionId}?token=${actualToken}`
    : window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(submissionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (submissionDetails) {
      setFormReady(true);
    }
  }, [submissionDetails]);

  if (loading) {
    return (
      <AppLayout hideHeader>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!actualSubmissionId || !submissionDetails || error) {
    return (
      <AppLayout hideHeader>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h3>{error ? 'Error' : 'Submission not found'}</h3>
            <p className="text-muted">{error || 'The requested submission could not be loaded.'}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideHeader>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
          <div className="w-100">
            {/* Success Header */}
            <div className="text-center mb-2">
              <Badge bg="success" className="my-3 d-inline-flex align-items-center">
                <CheckCircle size={16} className="me-2" />
                Submission Successful
              </Badge>
              <h1 className="display-6 fw-bold text-dark">Thank You!</h1>
            </div>
            {/* Status Alerts */}
            <div className="mt-4">
              <Alert variant="success" className="d-flex align-items-start">
                <CheckCircle size={20} className="me-2 flex-shrink-0" />
                <div>
                  <strong>Submission Confirmed:</strong> Your response for {submissionDetails.form_name} has been successfully recorded and processed.
                </div>
              </Alert>

              {submissionDetails.is_form_owner && (
                <Alert variant="info" className="d-flex align-items-start">
                  <User size={20} className="me-2 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Form Owner Notice:</strong> This submission was made by {submissionDetails.submitter_information?.name ?? 'Anonymous'} (
                    {submissionDetails.submitter_information?.email ?? 'Anonymous'})
                  </div>
                </Alert>
              )}

              {submissionDetails.token && (
                <Alert variant="warning" className="d-flex align-items-start">
                  <Shield size={20} className="me-2 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Anonymous Submission:</strong> Keep your submission link safe as it's the only way to access this data later.
                  </div>
                </Alert>
              )}
            </div>

            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center">
                  <span className="text-muted">Submission ID:</span>
                  <Badge bg="light" text="dark" className="fw-bold">
                    #{submissionDetails.submission_id}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3">
                  {submissionDetails.token && (
                    <div>
                      <label className="form-label fw-semibold small">Submission Link</label>
                      <div className="d-flex gap-2">
                        <input type="text" className="form-control form-control-sm" value={submissionUrl} readOnly />
                        <Button variant="outline-secondary" size="sm" onClick={copyToClipboard} className="d-flex align-items-center">
                          <Copy size={14} className="me-1" />
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <div className="text-muted small mt-1">Bookmark this link to access your submission later</div>
                    </div>
                  )}
                  {submissionDetails.submitter_information && (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Submitter</span>
                      <div className="text-end">
                        <div className="fw-semibold text-dark">{submissionDetails.submitter_information.name}</div>
                        <div className="text-muted small">{submissionDetails.submitter_information.email}</div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <Button variant="primary" className="d-flex align-items-center justify-content-center">
                      <Download size={18} className="me-2" />
                      Download Submission
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Submitted Data Preview */}
            <Card className="shadow-sm border-0 mt-4">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0 fw-bold">Your Submission</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {formReady && (
                  <FormioForm
                    src={formSchema.current}
                    submission={{ data: submissionDetails.submission_data }}
                    options={{ readOnly: true }}
                  />
                )}
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-end align-items-center">
              <span className="text-muted">Created at: </span>
              <span className="text-dark">{new Date(submissionDetails.created_at).toLocaleString()}</span>
            </div>

            {/* Footer */}
            <div className="text-center mt-5">
              <p className="text-muted">Thank you for using Flowable Forms. If you have any questions, please contact support.</p>
            </div>
          </div>
        </Container>
      </div>
    </AppLayout>
  );
}

export const Route = createFileRoute('/forms/$formId/submit/success/$submissionId')({
  component: FormsSuccess,
});