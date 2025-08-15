import AppLayout from '@/layouts/app-layout';
import { Form } from '@/types/form';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Code, Eye, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge, Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function FormsSchema() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [schema, setSchema] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/forms/${id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setForm(data);
          setSchema(data.schema || '{}');
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchForm();
    }
  }, [id]);

  const handleUpdateSchema = async () => {
    if (!form || !schema) return;
    setProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forms/${form.id}/schema`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ schema }),
      });

      if (response.ok) {
        // Success toast would go here
        console.log('Schema updated successfully');
      } else {
        console.error('Failed to update schema');
      }
    } catch (error) {
      console.error('Error updating schema:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <AppLayout><div>Loading...</div></AppLayout>;
  }

  if (!form) {
    return <AppLayout><div>Form not found</div></AppLayout>;
  }

  const breadcrumbs = [
    {
      name: 'Manage Forms',
      href: '/forms',
    },
    {
      name: form.name,
      href: `/forms/${form.id}/manage`,
    },
    {
      name: 'Edit Schema',
      href: `/forms/${form.id}/schema`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Code size={16} className="me-2" />
              Schema Editor
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Edit {form.name}</h1>
            <p className="lead text-muted">Design your form structure and fields</p>
          </div>

          {/* Actions */}
          <Row className="g-4 mb-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold text-dark mb-1">Form Schema Editor</h6>
                      <p className="text-muted small mb-0">Modify your form structure using JSON schema</p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/forms/${form.id}/manage`}>
                        <Button variant="outline-secondary">
                          <ArrowLeft size={16} className="me-2" />
                          Back to Manage
                        </Button>
                      </Link>
                      <Link to={`/forms/${form.id}/preview`}>
                        <Button variant="outline-primary">
                          <Eye size={16} className="me-2" />
                          Preview
                        </Button>
                      </Link>
                      <Button 
                        variant="primary" 
                        onClick={handleUpdateSchema}
                        disabled={processing}
                      >
                        <Save size={16} className="me-2" />
                        {processing ? 'Saving...' : 'Save Schema'}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Schema Editor */}
          <Row className="g-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">JSON Schema</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows={20}
                      value={schema}
                      onChange={(e) => setSchema(e.target.value)}
                      style={{ fontFamily: 'monospace', fontSize: '14px' }}
                      placeholder="Enter your form schema here..."
                    />
                  </div>
                  <div className="text-muted small">
                    <strong>Tip:</strong> Edit the JSON schema above to define your form fields, validation rules, and layout.
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Schema Tips */}
          <Row className="g-4 mt-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                  <h6 className="fw-bold text-dark mb-2">Schema Guidelines</h6>
                  <div className="text-muted small">
                    <ul className="mb-0">
                      <li>Use valid JSON format for the schema</li>
                      <li>Define field types, labels, and validation rules</li>
                      <li>Test your changes using the Preview button</li>
                      <li>Save your changes before navigating away</li>
                    </ul>
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