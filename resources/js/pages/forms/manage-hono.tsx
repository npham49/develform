import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, FileText, Settings, Eye, Users, BarChart3 } from 'lucide-react'
import { Badge, Button, Card, Col, Container, Row, Nav } from 'react-bootstrap'
import AppLayout from '@/layouts/app-layout-hono'
import { type BreadcrumbItem } from '@/types'
import { useForm } from '@/hooks/use-forms'

export default function FormManage() {
  const { formId } = useParams({ from: '/forms/$formId/manage' })
  const { data: form, isLoading } = useForm(Number(formId))

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Forms',
      href: '/forms',
    },
    {
      title: form?.name || 'Loading...',
      href: `/forms/${formId}/manage`,
    },
  ]

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
          <Container className="py-5">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Container>
        </div>
      </AppLayout>
    )
  }

  if (!form) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
          <Container className="py-5">
            <div className="text-center">
              <h3>Form not found</h3>
              <Link to="/forms">
                <Button variant="primary">Back to Forms</Button>
              </Link>
            </div>
          </Container>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <Link to="/forms" className="text-decoration-none mb-3 d-inline-block">
                <Button variant="outline-secondary" size="sm" className="d-flex align-items-center">
                  <ArrowLeft size={16} className="me-2" />
                  Back to Forms
                </Button>
              </Link>
              <div className="d-flex align-items-center mb-2">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                  style={{ width: 48, height: 48, backgroundColor: '#e0e7ff' }}
                >
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="h3 fw-bold text-dark mb-1">{form.name}</h1>
                  <p className="text-muted mb-0">{form.description || 'No description provided'}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg={form.isPublic ? 'success' : 'warning'}>
                  {form.isPublic ? 'Public' : 'Private'}
                </Badge>
                <Badge bg="secondary">
                  {form._count?.submissions || 0} submissions
                </Badge>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" className="d-flex align-items-center">
                <Eye size={16} className="me-2" />
                Preview
              </Button>
              <Button variant="primary" className="d-flex align-items-center">
                <Settings size={16} className="me-2" />
                Edit Schema
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Card className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-white">
              <Nav variant="tabs" defaultActiveKey="overview" className="border-0">
                <Nav.Item>
                  <Nav.Link eventKey="overview" className="fw-semibold">
                    <BarChart3 size={16} className="me-2" />
                    Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="submissions" className="fw-semibold">
                    <Users size={16} className="me-2" />
                    Submissions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="settings" className="fw-semibold">
                    <Settings size={16} className="me-2" />
                    Settings
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
          </Card>

          {/* Content */}
          <Row className="g-4">
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Form Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="text-center p-4">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{ width: 60, height: 60, backgroundColor: '#dcfce7' }}
                        >
                          <Users size={24} className="text-success" />
                        </div>
                        <h3 className="fw-bold text-dark">{form._count?.submissions || 0}</h3>
                        <p className="text-muted mb-0">Total Submissions</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-4">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{ width: 60, height: 60, backgroundColor: '#dbeafe' }}
                        >
                          <FileText size={24} className="text-primary" />
                        </div>
                        <h3 className="fw-bold text-dark">{form.schema ? Object.keys(form.schema).length : 0}</h3>
                        <p className="text-muted mb-0">Form Fields</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Quick Actions</h5>
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-3">
                  <Button variant="primary" className="w-100 d-flex align-items-center">
                    <Settings size={18} className="me-2" />
                    Edit Form Schema
                  </Button>
                  <Button variant="outline-primary" className="w-100 d-flex align-items-center">
                    <Eye size={18} className="me-2" />
                    Preview Form
                  </Button>
                  <Button variant="outline-secondary" className="w-100 d-flex align-items-center">
                    <Users size={18} className="me-2" />
                    View Submissions
                  </Button>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0 mt-4">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Form Details</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <small className="text-muted d-block">Created</small>
                    <span className="fw-medium">{new Date(form.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Last Updated</small>
                    <span className="fw-medium">{new Date(form.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <small className="text-muted d-block">Status</small>
                    <Badge bg={form.isPublic ? 'success' : 'warning'}>
                      {form.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}