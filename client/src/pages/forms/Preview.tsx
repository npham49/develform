import { INITIAL_SCHEMA } from '@/lib/constants';
import { Form } from '@/types/form';
import { Webform } from '@formio/js';
import { Form as FormioForm, FormType, Submission } from '@formio/react';
import { ArrowLeft, Eye, Info, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function FormsPreview() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const formSchema = useRef<FormType>(INITIAL_SCHEMA);
  const previewRef = useRef<Webform>(null);
  const [formReady, setFormReady] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const formData = data.data || data;
          setForm(formData);
          formSchema.current = formData.schema ? formData.schema : INITIAL_SCHEMA;
          setFormReady(true);
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
        setFormReady(true);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="w-100">
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Eye size={16} className="me-2" />
              Form Preview
            </Badge>
            <h1 className="display-6 fw-bold text-dark">{form.name}</h1>
            <p className="lead text-muted">Preview your form as it will appear to users</p>
          </div>

          {/* Preview Notice */}
          <Alert variant="info" className="d-flex align-items-start mb-4">
            <Info size={20} className="me-2 mt-1 flex-shrink-0" />
            <div>
              <strong>Preview Mode:</strong> This is a preview of your form. Submissions will not be saved and are for testing purposes only.
            </div>
          </Alert>

          {/* Actions Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold text-dark mb-1">Ready to make changes?</h6>
                  <p className="text-muted small mb-0">Return to the form editor to modify your form structure</p>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/forms/${id}/manage`}>
                    <Button variant="outline-primary">
                      <ArrowLeft size={16} className="me-2" />
                      Back to Manage
                    </Button>
                  </Link>
                  <Link to={`/forms/${id}/schema`}>
                    <Button variant="primary">
                      <Settings size={16} className="me-2" />
                      Edit Schema
                    </Button>
                  </Link>
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
              {formReady && <FormioForm src={formSchema.current} onSubmit={handleSubmit} onFormReady={handleFormReady} />}
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
