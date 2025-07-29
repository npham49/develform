import { Link } from '@tanstack/react-router'
import { Calendar, Eye, FileText, Globe, Lock, MoreVertical, Plus, Settings } from 'lucide-react'
import { Badge, Button, Card, Col, Container, Dropdown, Row, Table } from 'react-bootstrap'
import AppLayout from '@/layouts/app-layout-hono'
import { type BreadcrumbItem } from '@/types'
import { useForms } from '@/hooks/use-forms'

interface Form {
  id: number
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    submissions: number
  }
}

export default function FormsIndex() {
  const { data: forms = [], isLoading } = useForms()

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: '/forms',
    },
  ]

  // Sort forms by updatedAt and get the 4 most recent
  const recentForms = [...forms].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4)

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <FileText size={16} className="me-2" />
              Form Management
            </Badge>
            <h1 className="display-5 fw-bold text-dark">Your Forms</h1>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Create, edit, and manage all your forms from one central location. Track submissions and monitor performance.
            </p>
          </div>

          {/* Action Bar */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 fw-semibold text-dark">All Forms ({forms.length})</h4>
            </div>
            <Link to="/forms/create" className="text-decoration-none">
              <Button variant="primary" className="d-flex align-items-center">
                <Plus size={18} className="me-2" />
                Create New Form
              </Button>
            </Link>
          </div>

          {forms.length === 0 ? (
            <Card className="shadow-sm border-0 text-center py-5">
              <Card.Body>
                <div className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{ width: 80, height: 80, backgroundColor: '#f8f9fa' }}
                  >
                    <FileText size={32} className="text-muted" />
                  </div>
                  <h3 className="fw-bold text-dark mb-3">No Forms Yet</h3>
                  <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    Create your first form to get started with collecting submissions and managing your data.
                  </p>
                  <Link to="/forms/create" className="text-decoration-none">
                    <Button variant="primary" size="lg" className="d-flex align-items-center mx-auto">
                      <Plus size={20} className="me-2" />
                      Create Your First Form
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <>
              {/* Recent Forms Cards */}
              <div className="mb-5">
                <h5 className="fw-semibold text-dark mb-3">Recent Forms</h5>
                <Row className="g-4">
                  {recentForms.map((form) => (
                    <Col lg={3} md={6} key={form.id}>
                      <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                              className="d-inline-flex align-items-center justify-content-center rounded-circle"
                              style={{ width: 40, height: 40, backgroundColor: '#e0e7ff' }}
                            >
                              <FileText size={20} className="text-primary" />
                            </div>
                            <Badge bg={form.isPublic ? 'success' : 'warning'} className="d-flex align-items-center">
                              {form.isPublic ? <Globe size={12} className="me-1" /> : <Lock size={12} className="me-1" />}
                              {form.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                          <h6 className="fw-bold text-dark mb-2 text-truncate">{form.name}</h6>
                          <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
                            {form.description || 'No description provided'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted d-flex align-items-center">
                              <Calendar size={12} className="me-1" />
                              {new Date(form.updatedAt).toLocaleDateString()}
                            </small>
                            <div className="d-flex gap-2">
                              <Link to={`/forms/${form.id}/manage`}>
                                <Button variant="outline-primary" size="sm">
                                  <Settings size={14} />
                                </Button>
                              </Link>
                              <Button variant="outline-secondary" size="sm">
                                <Eye size={14} />
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* All Forms Table */}
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">All Forms</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 fw-semibold">Form Name</th>
                        <th className="border-0 fw-semibold">Status</th>
                        <th className="border-0 fw-semibold">Submissions</th>
                        <th className="border-0 fw-semibold">Last Updated</th>
                        <th className="border-0 fw-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forms.map((form) => (
                        <tr key={form.id}>
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
                              <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                                style={{ width: 32, height: 32, backgroundColor: '#e0e7ff' }}
                              >
                                <FileText size={16} className="text-primary" />
                              </div>
                              <div>
                                <div className="fw-semibold text-dark">{form.name}</div>
                                <small className="text-muted">
                                  {form.description && form.description.length > 50
                                    ? `${form.description.substring(0, 50)}...`
                                    : form.description || 'No description'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <Badge bg={form.isPublic ? 'success' : 'warning'} className="d-flex align-items-center w-fit">
                              {form.isPublic ? <Globe size={12} className="me-1" /> : <Lock size={12} className="me-1" />}
                              {form.isPublic ? 'Public' : 'Private'}
                            </Badge>
                          </td>
                          <td className="align-middle">
                            <span className="fw-medium">{form._count?.submissions || 0}</span>
                          </td>
                          <td className="align-middle">
                            <small className="text-muted">{new Date(form.updatedAt).toLocaleDateString()}</small>
                          </td>
                          <td className="align-middle">
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0">
                                <MoreVertical size={14} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Link to={`/forms/${form.id}/manage`} className="text-decoration-none">
                                  <Dropdown.Item>
                                    <Settings size={14} className="me-2" />
                                    Manage
                                  </Dropdown.Item>
                                </Link>
                                <Dropdown.Item>
                                  <Eye size={14} className="me-2" />
                                  Preview
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="text-danger">
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </div>
    </AppLayout>
  )
}