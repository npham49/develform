import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/layouts/app-layout';
import { Form } from '@formio/react';
import { FileText, Info, Shield, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Card, Container } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface SubmitProps {
  schema?: string;
  name?: string;
  form_id?: number;
}

export default function FormsSubmit({ schema, form_id }: SubmitProps) {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const formSchema = useRef(schema ? JSON.parse(schema) : {});
  const [formReady, setFormReady] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  
  const actualFormId = form_id || (formId ? parseInt(formId) : null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchFormData = async () => {
      if (!actualFormId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch form data from API
        console.log('Fetching form data for form ID:', actualFormId);
        const response = await api.forms.getSubmitSchema(actualFormId);
        const formInfo = response.data;
        
        setFormData(formInfo);
        if (formInfo.schema) {
          formSchema.current = formInfo.schema;
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [actualFormId]);

  useEffect(() => {
    if (formData) {
      setFormReady(true);
    }

    return () => {
      setFormReady(false);
    };
  }, [formData]);

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
        data: submissionData
      });
      
      // Call the API endpoint to submit the form
      const response = await api.submissions.submitToForm(actualFormId, submissionData);

      const submissionResult = response.data;
      console.log('Submission successful:', submissionResult);

      // Redirect to success page with submission ID and token (if anonymous)
      const successUrl = `/forms/${actualFormId}/submit/success/${submissionResult.id}`;
      const urlWithToken = submissionResult.token ? `${successUrl}?token=${submissionResult.token}` : successUrl;
      
      navigate(urlWithToken);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

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
                <div className="d-flex align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                  >
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">{formData.name}</h5>
                    <p className="text-muted small mb-0">Complete all required fields and submit your response</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {formReady && (
                  <Form 
                    src={formSchema.current} 
                    onChange={handleChange} 
                    onSubmit={handleSubmit}
                    options={{ 
                      noAlerts: true,
                      readOnly: submitting 
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