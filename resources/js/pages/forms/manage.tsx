import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form } from '@/types/form';
import { Version } from '@/types/version';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Edit3, Eye, FileText, Globe, Lock, Plus, Send, Settings } from 'lucide-react';
import { useState } from 'react';
import { Badge, Form as BootstrapForm, Button, Card, Col, Container, Modal, Row, Table } from 'react-bootstrap';
import { toast } from 'sonner';

interface FormsManageProps {
  form: Form;
  versions: Version[];
}

export default function FormsManage({ form, versions }: FormsManageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manage Forms',
      href: route('forms.index'),
    },
    {
      title: form.name,
      href: route('forms.manage', form.id),
    },
  ];

  const { data, setData, post, processing } = useForm({
    title: '',
    description: '',
    based_on: versions[0] ? versions[0].id : null,
    form_id: form.id,
  });

  const handleSubmit = () => {
    post(route('forms.versions.store', form.id), {
      onSuccess: () => {
        handleClose();
        toast.success('Version created successfully');
        router.reload({ only: ['versions'] });
      },
      onError: (e) => {
        console.log(e);
        toast.error('Failed to create version');
      },
    });
  };

  const handleShowFromVersion = (version: Version) => {
    setData('based_on', version.version_number);
    handleShow();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Manage ${form.name}`} />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <Settings size={16} className="me-2" />
              Form Management
            </Badge>
            <h1 className="display-6 fw-bold text-dark">{form.name}</h1>
            <p className="lead text-muted">Manage your form settings, view submissions, and track performance</p>
          </div>

          {/* Back Button */}
          <div className="mb-4">
            <Link href={route('forms.index')} className="text-decoration-none">
              <Button variant="outline-secondary" className="d-flex align-items-center">
                <ArrowLeft size={16} className="me-2" />
                Back to Forms
              </Button>
            </Link>
          </div>

          <Row className="g-4">
            {/* Form Details Card */}
            <Col lg={8}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                      style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                    >
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Form Details</h5>
                      <p className="text-muted small mb-0">Basic information about your form</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <div className="fw-semibold text-dark">Form Name</div>
                        <div className="text-muted">{form.name}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {form.is_public ? (
                          <Badge bg="success" className="d-flex align-items-center">
                            <Globe size={12} className="me-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="d-flex align-items-center">
                            <Lock size={12} className="me-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="fw-semibold text-dark">Description</div>
                      <div className="text-muted">{form.description || 'No description provided'}</div>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                      <div>
                        <div className="fw-semibold text-dark small">Created</div>
                        <div className="text-muted small d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(form.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold text-dark small">Last Updated</div>
                        <div className="text-muted small d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {new Date(form.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Quick Actions Card */}
            <Col lg={4}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <h5 className="mb-0 fw-bold">Quick Actions</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="d-flex flex-column gap-3">
                    <Link href={route('forms.schema', [form.id, form.version_id])} className="text-decoration-none">
                      <Button variant="primary" className="w-100 d-flex align-items-center">
                        <Edit3 size={18} className="me-2" />
                        Edit Schema
                      </Button>
                    </Link>
                    <Link href={route('forms.preview', form.id)} className="text-decoration-none">
                      <Button variant="outline-primary" className="w-100 d-flex align-items-center">
                        <Eye size={18} className="me-2" />
                        Preview Form
                      </Button>
                    </Link>
                    <Link href={route('submit', form.id)} className="text-decoration-none">
                      <Button variant="outline-success" className="w-100 d-flex align-items-center">
                        <Send size={18} className="me-2" />
                        Submit Form
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats and Analytics Row */}
          {/* <Row className="g-4 mt-4">
            <Col lg={12}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Form Analytics</h5>
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                      <BarChart3 size={16} className="me-1" />
                      View Details
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-4">
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#dbeafe' }}
                        >
                          <Send size={20} className="text-primary" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">Total Submissions</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#dcfce7' }}
                        >
                          <Eye size={20} className="text-success" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">Total Views</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#ede9fe' }}
                        >
                          <BarChart3 size={20} className="text-purple" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0%
                        </div>
                        <div className="text-muted small">Conversion Rate</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                          style={{ width: 48, height: 48, backgroundColor: '#ffedd5' }}
                        >
                          <Calendar size={20} className="text-warning" />
                        </div>
                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '1.5rem' }}>
                          0
                        </div>
                        <div className="text-muted small">This Week</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}

          {/* Recent Activity */}
          <Row className="g-4 mt-4">
            <Col lg={12}>
              <Table responsive className="mb-0 z-n1">
                <thead className="table-light">
                  <tr>
                    <th className="py-3">Version</th>
                    <th className="py-3 w-50">Title</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Created</th>
                    <th className="py-3">Updated</th>
                    <th className="py-3 pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.length > 0 ? (
                    versions.map((version, index) => (
                      <tr key={version.id} className={index % 2 === 0 ? 'table-light' : ''}>
                        <td className="py-3">
                          <div className="d-flex align-items-center align-middle justify-content-center">
                            <div className="text-muted text-center">{version.version_number}</div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div>
                              <div className="fw-semibold text-dark">{version.title}</div>
                              <div
                                className="text-muted small"
                                style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              >
                                {version.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          {version.is_live ? (
                            <Badge bg="success" className="d-flex align-items-center w-fit">
                              <Globe size={12} className="me-1" />
                              Live
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="d-flex align-items-center w-fit">
                              <Lock size={12} className="me-1" />
                              Editing
                            </Badge>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="text-muted small">{new Date(version.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-muted small">{new Date(version.updated_at).toLocaleDateString()}</div>
                        </td>
                        <td className="py-3 pe-4">
                          <div className="d-flex gap-2 justify-content-start">
                            <Link href={route('forms.schema', [form.id, version.id])} className="text-decoration-none">
                              <Button variant="primary" size="lg" className="d-flex align-items-center">
                                <Edit size={14} />
                              </Button>
                            </Link>
                            <Button variant="primary" size="lg" className="d-flex align-items-center" onClick={() => handleShowFromVersion(version)}>
                              <Plus size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="d-flex flex-column align-items-center">
                          <span className="text-muted">No versions found</span>
                          <Button variant="primary" className="d-flex align-items-center" onClick={handleShow}>
                            <Plus size={14} />
                            Create Version
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create Version</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <BootstrapForm onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <BootstrapForm.Group className="mb-3" controlId="formBasicEmail">
                  <BootstrapForm.Label>Title</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="text"
                    value={data.title}
                    placeholder="Enter title"
                    onChange={(e) => setData('title', e.target.value)}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-3" controlId="formBasicEmail">
                  <BootstrapForm.Label>Description</BootstrapForm.Label>
                  <BootstrapForm.Control
                    as="textarea"
                    rows={3}
                    value={data.description}
                    placeholder="Enter description"
                    onChange={(e) => setData('description', e.target.value)}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-3" controlId="formBasicEmail">
                  <BootstrapForm.Label>Based On Version</BootstrapForm.Label>
                  <BootstrapForm.Control disabled type="text" value={data.based_on || 'None'} placeholder="Enter based on" />
                </BootstrapForm.Group>
              </BootstrapForm>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={processing} onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </AppLayout>
  );
}
