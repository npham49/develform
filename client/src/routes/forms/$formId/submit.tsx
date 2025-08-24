import { createFileRoute, useLoaderData, useNavigate, useParams } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import { IconCard } from '@/components/common/icon-card';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { api } from '@/lib/api';
import type { FormSchema } from '@/types/api';
import { Form } from '@formio/react';
import { FileText, Info, Shield, User } from 'lucide-react';
import { Alert, Card, Container } from 'react-bootstrap';

export const Route = createFileRoute('/forms/$formId/submit')({
  loader: async ({ params }) => {
    try {
      const response = await api.forms.getSubmitSchema(parseInt(params.formId));
      return { form: response.data };
    } catch (error) {
      console.error('Error fetching form for submission:', error);
      throw error;
    }
  },
  staleTime: 0, // Always refetch
  gcTime: 0, // Don't cache
  component: FormsSubmit,
});

function FormsSubmit() {
  const { form } = useLoaderData({ from: '/forms/$formId/submit' }) as { form: FormSchema };
  const { formId } = useParams({ from: '/forms/$formId/submit' });
  const navigate = useNavigate({ from: '/forms/$formId/submit' });
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const formSchema = useRef(form?.schema || { components: [] });
  const [submissionData, setSubmissionData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  const actualFormId = form?.id || (formId ? parseInt(formId) : null);
  const isLoggedIn = !!user;
  const formData = form;

  const handleChange = (value: unknown, _flags: unknown, modified: boolean) => {
    if (modified && value && typeof value === 'object' && 'data' in value) {
      setSubmissionData((value as { data: Record<string, unknown> }).data);
    }
  };

  const handleSubmit = async () => {
    if (!actualFormId) {
      setError('Form ID is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      console.log('Submitting form data:', {
        formId: actualFormId,
        data: submissionData,
      });

      // Call the API endpoint to submit the form
      const versionSha = form.versionSha;
      if (!versionSha) {
        throw new Error('No version available for submission');
      }
      const response = await api.submissions.submitToForm(actualFormId, versionSha, submissionData);

      const submissionResult = response.data;
      console.log('Submission successful:', submissionResult);

      // Redirect to success page with submission ID and token (if anonymous)
      const successUrl = `/forms/${actualFormId}/success/${submissionResult.id}`;
      const urlWithToken = submissionResult.token ? `${successUrl}?token=${submissionResult.token}` : successUrl;

      navigate({ to: urlWithToken });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <AppLayout hideHeader>
        <div>Form not found</div>
      </AppLayout>
    );
  }

  if (!actualFormId || !formData || error) {
    return (
      <AppLayout hideHeader>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <h3>{error ? 'Error' : 'Form not found'}</h3>
            <p className="text-muted">{error || 'The requested form could not be loaded.'}</p>
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
            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="d-flex align-items-start mb-4">
                <Info size={20} className="me-2 mt-1 flex-shrink-0" />
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </Alert>
            )}

            {/* User Status Alert */}
            {!isLoggedIn ? (
              <Alert variant="info" className="d-flex align-items-start mb-4">
                <Info size={20} className="me-2 mt-1 flex-shrink-0" />
                <div>
                  <strong>Anonymous Submission:</strong> This is an anonymous submission. Please do not enter sensitive personal information.
                </div>
              </Alert>
            ) : (
              <Alert variant="success" className="d-flex align-items-start mb-4">
                <User size={20} className="me-2 mt-1 flex-shrink-0" />
                <div>
                  <strong>Authenticated Submission:</strong> Submitting as {user.name} ({user.email})
                </div>
              </Alert>
            )}

            {/* Form Card */}
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-4">
                <IconCard
                  icon={FileText}
                  iconColor="text-primary"
                  iconBg="#dbeafe"
                  title={formData.name}
                  description="Complete all required fields and submit your response"
                />
              </Card.Header>
              <Card.Body className="p-4">
                {formData && formSchema.current && (
                  <Form
                    src={formSchema.current}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    options={{
                      noAlerts: true,
                      readOnly: submitting,
                    }}
                  />
                )}
                {submitting && (
                  <div className="text-center mt-3">
                    <div className="spinner-border text-primary me-2" role="status">
                      <span className="visually-hidden">Submitting...</span>
                    </div>
                    <span>Submitting your response...</span>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Security Notice */}
            <Card className="shadow-sm border-0 mt-4">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                    style={{ width: 40, height: 40, backgroundColor: '#dcfce7' }}
                  >
                    <Shield size={20} className="text-success" />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-2">Your Privacy & Security</h6>
                    <div className="text-muted small">
                      <ul className="mb-0 ps-3">
                        <li>Your submission is encrypted and stored securely</li>
                        <li>We only collect the information you provide in this form</li>
                        <li>
                          {isLoggedIn ? 'Your submission is linked to your account' : 'Anonymous submissions are not linked to any personal data'}
                        </li>
                        <li>You can contact us anytime if you have questions about your data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </AppLayout>
  );
}
