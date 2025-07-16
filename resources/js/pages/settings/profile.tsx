import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { User, Mail, Shield, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Badge, Button, Card, Container, Row, Col } from 'react-bootstrap';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

type ProfileForm = {
  name: string;
  email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
    name: auth.user.name,
    email: auth.user.email || '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #ebf4ff, #e0e7ff)' }}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <Badge bg="secondary" className="mb-3 d-inline-flex align-items-center">
              <User size={16} className="me-2" />
              Profile Settings
            </Badge>
            <h1 className="display-6 fw-bold text-dark">Manage Your Profile</h1>
            <p className="lead text-muted">
              Update your personal information and account preferences
            </p>
          </div>

          <SettingsLayout>
            <Row className="g-4">
              {/* Profile Information Card */}
              <Col lg={8}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white py-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                        style={{ width: 40, height: 40, backgroundColor: '#dbeafe' }}
                      >
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Profile Information</h5>
                        <p className="text-muted small mb-0">Update your name and email address</p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <form onSubmit={submit}>
                      <div className="mb-4">
                        <label htmlFor="name" className="form-label fw-semibold">
                          Full Name
                        </label>
                        <div className="position-relative">
                          <input
                            id="name"
                            className={`form-control ps-5 ${errors.name ? 'is-invalid' : ''}`}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Enter your full name"
                          />
                          <User size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email Address
                        </label>
                        <div className="position-relative">
                          <input
                            id="email"
                            type="email"
                            className={`form-control ps-5 ${errors.email ? 'is-invalid' : ''}`}
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            placeholder={data.email ? "Enter your email address" : "No email available from GitHub"}
                            disabled={!auth.user.email}
                          />
                          <Mail size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          {!auth.user.email && (
                            <div className="form-text text-muted">
                              <small>Your GitHub account doesn't share an email address. You can update your GitHub privacy settings to make your email available.</small>
                            </div>
                          )}
                        </div>
                      </div>

                      {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div className="alert alert-warning d-flex align-items-start mb-4">
                          <AlertTriangle size={20} className="me-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="mb-2">
                              Your email address is unverified.{' '}
                              <Link href={route('verification.send')} method="post" as="button" className="text-decoration-none fw-semibold">
                                Click here to resend the verification email.
                              </Link>
                            </p>
                            {status === 'verification-link-sent' && (
                              <div className="text-success fw-semibold d-flex align-items-center">
                                <CheckCircle size={16} className="me-1" />
                                A new verification link has been sent to your email address.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-3">
                        <Button type="submit" disabled={processing} variant="primary" className="d-flex align-items-center">
                          {processing ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} className="me-2" />
                              Save Changes
                            </>
                          )}
                        </Button>

                        <Transition
                          show={recentlySuccessful}
                          enter="transition ease-in-out"
                          enterFrom="opacity-0"
                          leave="transition ease-in-out"
                          leaveTo="opacity-0"
                        >
                          <div className="d-flex align-items-center text-success">
                            <CheckCircle size={16} className="me-1" />
                            <span className="small fw-semibold">Saved successfully</span>
                          </div>
                        </Transition>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              </Col>

              {/* Account Status Card */}
              <Col lg={4}>
                <Card className="shadow-sm border-0">
                  <Card.Header className="bg-white py-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                        style={{ width: 40, height: 40, backgroundColor: '#dcfce7' }}
                      >
                        <Shield size={20} className="text-success" />
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">Account Status</h5>
                        <p className="text-muted small mb-0">Your account information</p>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted small">Email Status</span>
                        {auth.user.email_verified_at ? (
                          <Badge bg="success" className="d-flex align-items-center">
                            <CheckCircle size={12} className="me-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge bg="warning" className="d-flex align-items-center">
                            <AlertTriangle size={12} className="me-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted small">Member Since</span>
                        <span className="small">
                          {new Date(auth.user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Danger Zone */}
            <Card className="shadow-sm border-danger mt-4">
              <Card.Header className="bg-danger-subtle py-3">
                <div className="d-flex align-items-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ width: 40, height: 40, backgroundColor: '#fef2f2' }}
                  >
                    <Trash2 size={20} className="text-danger" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-danger">Danger Zone</h5>
                    <p className="text-muted small mb-0">Irreversible actions that affect your account</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-semibold text-danger mb-1">Delete Account</h6>
                    <p className="text-muted small mb-0">
                      This action cannot be undone. All data will be permanently removed.
                    </p>
                  </div>
                  <Button variant="outline-danger" className="d-flex align-items-center">
                    <Trash2 size={18} className="me-2" />
                    Delete Account
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </SettingsLayout>
        </Container>
      </div>
    </AppLayout>
  );
}
