import { type SharedData } from '@/types';
import { Form } from '@formio/react';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FileText, User, Shield, Info } from 'lucide-react';
import { Badge, Card, Container, Alert } from 'react-bootstrap';

interface SubmitProps {
  schema: string;
  name: string;
  form_id: string;
}

export default function Submit({ schema, name, form_id }: SubmitProps) {
  const formSchema = useRef(JSON.parse(schema ?? '{}'));
  const [formReady, setFormReady] = useState(false);
  const [submissionData, setSubmissionData] = useState({});

  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = !!auth?.user;

  const handleChange = (value: unknown, flags: unknown, modified: boolean) => {
    if (modified && value && typeof value === 'object' && 'data' in value) {
      setSubmissionData((value as { data: Record<string, unknown> }).data);
    }
  };

  const handleSubmit = () => {
    router.post(route('forms.submit', form_id), {
      data: JSON.stringify(submissionData),
    });
  };

  useEffect(() => {
    setFormReady(true);

    return () => {
      setFormReady(false);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
      <Head title={`Submit ${name}`} />
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '800px' }}>
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <FileText size={16} className="me-2" />
              Form Submission
            </Badge>
            <h1 className="display-6 fw-bold text-dark">{name}</h1>
            <p className="lead text-muted">
              Please fill out the form below and submit your response
            </p>
          </div>

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
                <strong>Authenticated Submission:</strong> Submitting as {auth.user.name} ({auth.user.email})
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
                  <h5 className="mb-0 fw-bold">{name}</h5>
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
                />
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
                      <li>{isLoggedIn ? 'Your submission is linked to your account' : 'Anonymous submissions are not linked to any personal data'}</li>
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
  );
}
