import { INITIAL_SCHEMA } from '@/lib/constants';
import { Form } from '@/types/form';
import { Webform } from '@formio/js';
import { Form as FormioForm, FormType, Submission } from '@formio/react';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { FileText, Eye, ArrowLeft, Calendar, User, Info, Settings } from 'lucide-react';
import { Badge, Card, Container, Alert, Button } from 'react-bootstrap';
import { toast } from 'sonner';

interface FormsPreviewProps {
  form: Form;
}

export default function FormsPreview({ form }: FormsPreviewProps) {
  const formSchema = useRef<FormType>(JSON.parse(form.schema ?? '{}') ?? INITIAL_SCHEMA);
  const previewRef = useRef<Webform>(null);
  const [formReady, setFormReady] = useState(false);

  const handleSubmit = (submission: Submission) => {
    if (previewRef.current) {
      previewRef.current.emit('submitDone', submission);
      console.log(submission);
      toast.success('PREVIEW: Form submitted successfully');
    }
  };

  const handleFormReady = (form: Webform) => {
    previewRef.current = form;
  };

  useEffect(() => {
    setFormReady(true);

    return () => {
      formSchema.current = INITIAL_SCHEMA;
      previewRef.current = null;
      setFormReady(false);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
      <Head title={`Preview ${form.name}`} />
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Eye size={16} className="me-2" />
              Form Preview
            </Badge>
            <h1 className="display-6 fw-bold text-dark">{form.name}</h1>
            <p className="lead text-muted">
              Preview your form as it will appear to users
            </p>
          </div>

          {/* Preview Notice */}
          <Alert variant="info" className="d-flex align-items-start mb-4">
            <Info size={20} className="me-2 mt-1 flex-shrink-0" />
            <div>
              <strong>Preview Mode:</strong> This is a preview of your form. Submissions will not be saved and are for testing purposes only.
            </div>
          </Alert>

          {/* Form Details Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                  >
                    <FileText size={20} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Form Details</h5>
                    <p className="text-muted small mb-0">Information about this form</p>
                  </div>
                </div>
                                 <Badge bg={form.is_public ? 'success' : 'secondary'}>
                   {form.is_public ? 'Public' : 'Private'}
                 </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 32, height: 32, backgroundColor: '#f3f4f6' }}
                    >
                      <FileText size={16} className="text-dark" />
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Form Name</div>
                      <div className="text-muted small">{form.name}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 32, height: 32, backgroundColor: '#f3f4f6' }}
                    >
                      <Calendar size={16} className="text-dark" />
                    </div>
                    <div>
                      <div className="fw-semibold text-dark">Last Updated</div>
                      <div className="text-muted small">{new Date(form.updated_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 32, height: 32, backgroundColor: '#f3f4f6' }}
                    >
                      <User size={16} className="text-dark" />
                    </div>
                                         <div>
                       <div className="fw-semibold text-dark">Created</div>
                       <div className="text-muted small">{new Date(form.created_at).toLocaleDateString()}</div>
                     </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 32, height: 32, backgroundColor: '#f3f4f6' }}
                    >
                      <Settings size={16} className="text-dark" />
                    </div>
                                         <div>
                       <div className="fw-semibold text-dark">Status</div>
                       <div className="text-muted small">{form.is_public ? 'Public - accepting submissions' : 'Private - restricted access'}</div>
                     </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Form Preview Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-4">
              <div className="d-flex align-items-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                  style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                >
                  <Eye size={20} className="text-primary" />
                </div>
                <div>
                  <h5 className="mb-0 fw-bold">{form.name}</h5>
                  <p className="text-muted small mb-0">This is how your form will appear to users</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {formReady && (
                <FormioForm src={formSchema.current} onSubmit={handleSubmit} onFormReady={handleFormReady} />
              )}
            </Card.Body>
          </Card>

          {/* Actions Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Ready to make changes?</h6>
                  <p className="text-muted small mb-0">Return to the form editor to modify your form structure</p>
                </div>
                <div className="d-flex gap-2">
                  <Link href={route('forms.manage', form.id)}>
                    <Button variant="outline-primary">
                      <ArrowLeft size={16} className="me-2" />
                      Back to Manage
                    </Button>
                  </Link>
                  <Link href={route('forms.schema', form.id)}>
                    <Button variant="primary">
                      <Settings size={16} className="me-2" />
                      Edit Schema
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Preview Tips */}
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="d-flex align-items-start">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: '#dcfce7' }}
                >
                  <Info size={20} className="text-success" />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-2">Preview Tips</h6>
                  <div className="text-muted small">
                    <ul className="mb-0 ps-3">
                      <li>Test all form fields to ensure they work as expected</li>
                      <li>Check validation rules and error messages</li>
                      <li>Verify the form layout looks good on different screen sizes</li>
                      <li>Form submissions in preview mode are not saved</li>
                      <li>Use the "Edit Schema" button to make changes to the form structure</li>
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
