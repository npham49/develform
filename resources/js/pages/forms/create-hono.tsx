import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, FileText, Plus, Info } from 'lucide-react'
import { Badge, Button, Card, Col, Container, Row, Form, Alert } from 'react-bootstrap'
import { toast } from 'sonner'
import AppLayout from '@/layouts/app-layout-hono'
import { type BreadcrumbItem } from '@/types'
import { useCreateForm } from '@/hooks/use-forms'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Form',
    href: '/forms/create',
  },
]

export default function FormsCreate() {
  const router = useRouter()
  const createFormMutation = useCreateForm()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const result = await createFormMutation.mutateAsync(formData)
      toast.success('Form created successfully')
      router.navigate({ to: `/forms/${result.form.id}/manage` })
    } catch (error) {
      console.error('Failed to create form:', error)
      toast.error('Failed to create form')
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Plus size={16} className="me-2" />
              Create New Form
            </Badge>
            <h1 className="display-5 fw-bold text-dark">Create Your Form</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Start building your form with our intuitive form builder. Add fields, customize styling, and configure validation.
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-4">
            <Link to="/forms" className="text-decoration-none">
              <Button variant="outline-secondary" className="d-flex align-items-center">
                <ArrowLeft size={16} className="me-2" />
                Back to Forms
              </Button>
            </Link>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-4">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 40, height: 40, backgroundColor: '#e0e7ff' }}
                    >
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Form Details</h5>
                      <small className="text-muted">Basic information about your form</small>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={handleSubmit}>
                    {/* Form Name */}
                    <div className="mb-4">
                      <Form.Label className="fw-semibold">
                        Form Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter form name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        size="lg"
                      />
                      <Form.Text className="text-muted">
                        Give your form a clear, descriptive name that users will recognize.
                      </Form.Text>
                    </div>

                    {/* Form Description */}
                    <div className="mb-4">
                      <Form.Label className="fw-semibold">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe what this form is for"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                      <Form.Text className="text-muted">
                        Optional description to help you and others understand the purpose of this form.
                      </Form.Text>
                    </div>

                    {/* Public/Private Toggle */}
                    <div className="mb-4">
                      <Form.Label className="fw-semibold">Visibility</Form.Label>
                      <div className="border rounded p-3 bg-light">
                        <Form.Check
                          type="switch"
                          id="is-public-switch"
                          label="Make this form public"
                          checked={formData.is_public}
                          onChange={(e) => handleInputChange('is_public', e.target.checked)}
                        />
                        <small className="text-muted d-block mt-2">
                          {formData.is_public ? (
                            <>
                              <Info size={14} className="me-1" />
                              Public forms can be accessed by anyone with the link.
                            </>
                          ) : (
                            <>
                              <Info size={14} className="me-1" />
                              Private forms require authentication to access.
                            </>
                          )}
                        </small>
                      </div>
                    </div>

                    {/* Info Alert */}
                    <Alert variant="info" className="d-flex align-items-start">
                      <Info size={20} className="me-2 mt-1 text-info" />
                      <div>
                        <strong>What's next?</strong>
                        <p className="mb-0 mt-1">
                          After creating your form, you'll be taken to the form builder where you can add fields, configure validation, and customize the appearance.
                        </p>
                      </div>
                    </Alert>

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-between pt-3">
                      <Link to="/forms" className="text-decoration-none">
                        <Button variant="outline-secondary" disabled={createFormMutation.isPending}>
                          Cancel
                        </Button>
                      </Link>
                      <Button 
                        variant="primary" 
                        type="submit" 
                        disabled={createFormMutation.isPending || !formData.name.trim()}
                        className="d-flex align-items-center"
                      >
                        {createFormMutation.isPending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="me-2" />
                            Create Form
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}